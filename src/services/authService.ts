
import api from "@/api/axios";
import type { LoginPayload, RegisterPayload } from "@/types";

export const login = async (payload: LoginPayload) => {
  const response = await api.post("/login", payload);
  
  return {
    data: {
      user: response.data.user || response.data.data?.user,
      token: response.data.token || response.data.data?.token,
      success: response.data.success || true,
    }
  };
};

export const register = async (payload: RegisterPayload) => {
  const response = await api.post("/register", payload);
  
  return {
    data: {
      success: response.data.success || true,
      message: response.data.message,
    }
  };
};

export const getMe = async () => {
  const response = await api.get("/me");
  
  return {
    user: response.data.user || response.data.data?.user || response.data,
  };
};