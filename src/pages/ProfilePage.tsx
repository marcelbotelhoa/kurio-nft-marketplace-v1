// src/pages/ProfilePage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

// --- Schemas de Validação ---
const profileSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  username: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [savedMsg, setSavedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form de Dados Básicos
  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      username: (user as any)?.username || "",
      email: user?.email || "",
    },
  });

  // Form de Senha
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  // Mutação para salvar perfil
  const profileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const response = await api.patch("/api/profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data);
      setSavedMsg("Dados salvos com sucesso!");
      setErrorMsg("");
    },
  });

  // Mutação para salvar senha
  const passwordMutation = useMutation({
    mutationFn: async (data: PasswordForm) => {
      await api.patch("/api/profile/password", data);
    },
    onSuccess: () => {
      setSavedMsg("Senha alterada com sucesso!");
      setErrorMsg("");
      passwordForm.reset();
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || "Erro ao alterar senha.");
    },
  });

  const onProfileSubmit = (data: ProfileForm) => {
    setSavedMsg("");
    setErrorMsg("");
    profileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    setSavedMsg("");
    setErrorMsg("");
    passwordMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-5xl tracking-wide">Dados do perfil</h1>
        <p className="text-sm text-muted-foreground">Atualize suas informações de colecionador.</p>
      </div>

      <Card className="space-y-8 p-6 sm:p-8">
        {/* FORMULÁRIO DE DADOS */}
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-display-name">Nome de exibição</Label>
              <Input id="profile-display-name" {...profileForm.register("name")} />
              {profileForm.formState.errors.name && <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-username">Nome de usuário</Label>
              <Input id="profile-username" {...profileForm.register("username")} />
              {profileForm.formState.errors.username && <p className="text-sm text-destructive">{profileForm.formState.errors.username.message}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="profile-email">E-mail</Label>
              <Input id="profile-email" type="email" {...profileForm.register("email")} />
              {profileForm.formState.errors.email && <p className="text-sm text-destructive">{profileForm.formState.errors.email.message}</p>}
            </div>
          </div>
          <Button type="submit" disabled={profileMutation.isPending}>
            {profileMutation.isPending ? "Salvando..." : "Salvar dados"}
          </Button>
        </form>

        <hr className="border-border" />

        {/* FORMULÁRIO DE SENHA */}
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
          <h2 className="font-display text-2xl tracking-wide">Alterar senha</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="profile-current-password">Senha atual</Label>
              <Input id="profile-current-password" type="password" {...passwordForm.register("currentPassword")} />
              {passwordForm.formState.errors.currentPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-new-password">Nova senha</Label>
              <Input id="profile-new-password" type="password" {...passwordForm.register("newPassword")} />
              {passwordForm.formState.errors.newPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-confirm-password">Confirmar nova senha</Label>
              <Input id="profile-confirm-password" type="password" {...passwordForm.register("confirmPassword")} />
              {passwordForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>}
            </div>
          </div>
          <Button type="submit" disabled={passwordMutation.isPending}>
            {passwordMutation.isPending ? "Alterando..." : "Alterar senha"}
          </Button>
        </form>

        {/* Feedback Global */}
        {savedMsg && <p className="text-sm text-success">{savedMsg}</p>}
        {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
      </Card>
    </div>
  );
}