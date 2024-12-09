import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    accountType: string;
  };
}

interface CreateProductBody {
  title: string;
  description: string;
  price: number | string;
  category: string;
  condition: string;
  location: string;
  brand?: string;
  model?: string;
  color?: string;
  quantity?: string | number;
  features?: string[];
  specifications?: Record<string, string>;
  negotiable?: boolean;
  shipping?: boolean;
  warranty?: boolean;
  warrantyDuration?: string;
  images: string[];
}

export const createProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    if (req.user?.accountType !== "seller") {
      res.status(403).json({ error: "Only sellers can create products" });
      return;
    }

    const {
      title,
      description,
      price,
      category,
      condition,
      location,
      brand,
      model,
      color,
      quantity,
      features,
      specifications,
      negotiable,
      shipping,
      warranty,
      warrantyDuration,
      images,
    } = req.body as CreateProductBody;

    // Parse quantity to integer
    const parsedQuantity =
      typeof quantity === "string"
        ? parseInt(quantity, 10)
        : typeof quantity === "number"
          ? quantity
          : 1;

    // Convert specifications array to object
    const specificationsObject = Array.isArray(specifications)
      ? specifications.reduce(
          (acc, curr) => {
            if (curr.key && curr.value) {
              acc[curr.key] = curr.value;
            }
            return acc;
          },
          {} as Record<string, string>,
        )
      : {};

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: typeof price === "string" ? parseFloat(price) : price,
        category: category || "other",
        condition,
        location,
        brand,
        model,
        color,
        quantity: parsedQuantity,
        features: features || [],
        specifications: specificationsObject,
        negotiable: !!negotiable,
        shipping: !!shipping,
        warranty: !!warranty,
        warrantyDuration: warrantyDuration || null,
        images,
        sellerId,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const getProducts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const isSellerView = req.query.view === "seller";

    if (isSellerView && req.user?.accountType !== "seller") {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    const products = await prisma.product.findMany({
      where: isSellerView ? { sellerId: userId } : undefined,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.id;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    if (product.sellerId !== sellerId) {
      res.status(403).json({ error: "Not authorized to update this product" });
      return;
    }

    const {
      title,
      description,
      price,
      category,
      condition,
      location,
      brand,
      model,
      color,
      quantity,
      features,
      specifications,
      negotiable,
      shipping,
      warranty,
      warrantyDuration,
      images,
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price: typeof price === "string" ? parseFloat(price) : price,
        category,
        condition,
        location,
        brand,
        model,
        color,
        quantity,
        features,
        specifications,
        negotiable,
        shipping,
        warranty,
        warrantyDuration,
        images,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.id;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    if (product.sellerId !== sellerId) {
      res.status(403).json({ error: "Not authorized to delete this product" });
      return;
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
