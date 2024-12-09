import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    accountType?: string;
  };
}

export const register = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with 'unknown' accountType
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        accountType: "unknown", // Set default type to unknown
      },
      include: {
        profile: true,
      },
    });

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with profile included
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const updateAccountType = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { accountType, profile } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!accountType || !["buyer", "seller"].includes(accountType)) {
      res.status(400).json({ error: "Invalid account type" });
      return;
    }

    // Update user and create profile in a transaction
    const updatedUser = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Check if profile exists
        const existingProfile = await tx.profile.findUnique({
          where: { userId },
        });

        const user = await tx.user.update({
          where: { id: userId },
          data: {
            accountType,
            profile: existingProfile
              ? {
                  update: {
                    ...profile,
                  },
                }
              : {
                  create: {
                    ...profile,
                  },
                },
          },
          include: {
            profile: true,
          },
        });
        return user;
      },
    );

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Update account type error:", error);
    res.status(500).json({ error: "Failed to update account type" });
  }
};
