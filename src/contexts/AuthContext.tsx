// src/contexts/AuthContext.tsx
import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isSessionLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const token = localStorage.getItem("@kurio:token");
      if (!token) return null;
      
      try {
        const response = await api.get<AuthUser>("/api/auth/me");
        return response.data;
      } catch {
        localStorage.removeItem("@kurio:token");
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: any) => {
      const response = await api.post("/api/auth/login", { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("@kurio:token", data.token);
      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async ({ name, email, password }: any) => {
      const response = await api.post("/api/auth/signup", { name, email, password });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("@kurio:token", data.token);
      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/auth/logout");
    },
    onSuccess: () => {
      localStorage.removeItem("@kurio:token");
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.removeQueries({ queryKey: ["quote"] });
      queryClient.removeQueries({ queryKey: ["orders"] });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading: isSessionLoading,
        login: async (email, password) => { await loginMutation.mutateAsync({ email, password }); },
        signup: async (name, email, password) => { await signupMutation.mutateAsync({ name, email, password }); },
        logout: async () => { await logoutMutation.mutateAsync(); },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}