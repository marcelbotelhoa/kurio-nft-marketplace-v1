// src/pages/WalletsPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet as WalletIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { api } from "@/lib/api";
import type { Wallet } from "@/mocks/db";

const NETWORK_OPTIONS = ["Ethereum", "Polygon", "Solana"] as const;

const walletSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  address: z.string().min(10, "Endereço inválido").startsWith("0x", "O endereço deve começar com 0x"),
  network: z.enum(NETWORK_OPTIONS),
});

type WalletForm = z.infer<typeof walletSchema>;

export default function WalletsPage() {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState("");

  // 1. Busca as carteiras do usuário logado
  const { data: wallets = [], isLoading } = useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      const response = await api.get<Wallet[]>("/api/wallets");
      return response.data;
    },
  });

  // 2. Formulário para nova carteira
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WalletForm>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      network: "Ethereum",
    },
  });

  // 3. Mutation para criar nova carteira
  const createMutation = useMutation({
    mutationFn: async (data: WalletForm) => {
      const response = await api.post("/api/wallets", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      setSuccessMsg("Carteira cadastrada com sucesso!");
      reset();
      setTimeout(() => setSuccessMsg(""), 3000);
    },
  });

  // 4. Mutation para definir como principal
  const setPrimaryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/api/wallets/${id}`, { isPrimary: true });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  const onSubmit = (data: WalletForm) => {
    setSuccessMsg("");
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-5xl tracking-wide">Carteiras</h1>
        <p className="text-sm text-muted-foreground">
          Suas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
        </p>
      </div>

      <Card className="space-y-6 p-6 sm:p-8">
        <h2 className="font-display text-2xl tracking-wide">Cadastrar nova carteira</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 sm:grid-cols-2">
          
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="wallet-name">Nome de exibição</Label>
            <Input id="wallet-name" placeholder="Ex.: Minha MetaMask" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet-network">Rede</Label>
            <Select id="wallet-network" {...register("network")}>
              {NETWORK_OPTIONS.map((network) => (
                <option key={network} value={network}>{network}</option>
              ))}
            </Select>
            {errors.network && <p className="text-sm text-destructive">{errors.network.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet-address">Endereço</Label>
            <Input id="wallet-address" placeholder="0x..." className="font-mono" {...register("address")} />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>

          <div className="flex items-center gap-4 sm:col-span-2 mt-2">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Salvando..." : "Salvar carteira"}
            </Button>
            {successMsg && <p className="text-sm text-success">{successMsg}</p>}
            {createMutation.isError && <p className="text-sm text-destructive">Erro ao salvar carteira.</p>}
          </div>
        </form>
      </Card>

      <Card className="space-y-4 p-6 sm:p-8">
        <h2 className="font-display text-2xl tracking-wide">Suas carteiras</h2>
        
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-16 w-full bg-muted rounded-lg"></div>
            <div className="h-16 w-full bg-muted rounded-lg"></div>
          </div>
        ) : wallets.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">Nenhuma carteira cadastrada ainda.</p>
        ) : (
          <ul className="divide-y divide-border">
            {wallets.map((wallet) => (
              <li key={wallet.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <WalletIcon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold flex items-center gap-2">
                      {wallet.name}
                      {wallet.isPrimary && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary font-bold">
                          <Star className="size-3 fill-primary" /> Principal
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {wallet.network} · <span className="font-mono">{wallet.address}</span>
                    </p>
                  </div>
                </div>
                
                {!wallet.isPrimary && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPrimaryMutation.mutate(wallet.id)}
                    disabled={setPrimaryMutation.isPending}
                  >
                    Tornar Principal
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}