export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  brand: string;
  model: string;
  color: string;
  quantity: string;
  location: string;
  features: string[];
  specifications: { key: string; value: string }[];
  negotiable: boolean;
  shipping: boolean;
  warranty: boolean;
  warrantyDuration: string;
  images: string[];
}

export interface Product extends Omit<ProductFormData, "price" | "quantity"> {
  id: string;
  price: number;
  quantity: number;
  sellerId: string;
  seller: {
    id: string;
    name: string;
    profile?: {
      businessName?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}
