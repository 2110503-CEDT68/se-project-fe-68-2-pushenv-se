import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";
import type { ApiResponse } from "@/types/api";

type LoginData = {
  email: string;
  password: string;
};

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await api.post<ApiResponse<{ token: string }>>("/auth/login", data);
      setToken(res.data.token);
      return res.data;
    },
  });
}
