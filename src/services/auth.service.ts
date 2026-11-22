
import api from "@/lib/api";

export interface RegisterPayload {
  name: string;
  email: string;
  photo?: string;
  password: string;
  role: "customer";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface GoogleLoginPayload {
  credential: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  photo?: string;
  role: "customer" | "owner" | "admin";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    payload
  );

  return response.data;
};

export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    payload
  );

  return response.data;
};

export const googleLogin = async (
  payload: GoogleLoginPayload
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/google",
    payload
  );

  return response.data;
};
