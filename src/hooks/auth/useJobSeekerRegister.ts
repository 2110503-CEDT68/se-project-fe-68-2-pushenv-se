import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export function useJobSeekerRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      // The API response is expected to return { token: string }
      return api.post<ApiResponse<{ token: string }>>("/auth/register", {
        ...data,
        role: "jobSeeker",
      });
    },
  });
}
