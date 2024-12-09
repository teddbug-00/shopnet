export type UserType = "buyer" | "seller" | "unknown";

export interface Profile {
  id: string;
  phone?: string;
  address?: string;
  businessName?: string;
  businessDescription?: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  accountType: UserType | null;
  profileImage?: string;
  profile?: Profile;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AccountSetupData {
  accountType: UserType;
  profile: {
    phone: string;
    address: string;
    businessName?: string;
    businessDescription?: string;
    preferences?: string;
  };
}
