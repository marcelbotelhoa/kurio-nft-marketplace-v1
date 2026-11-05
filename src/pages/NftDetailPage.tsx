import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router"; // <-- TanStack Router
import { useQuery } from "@tanstack/react-query";
import { AddToCartButton } from "@/components/AddToCartButton";
import { QuantityControl } from "@/components/QuantityControl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { formatDate, formatEth } from "@/lib/format";
import type { Nft } from "@/mocks/db";

export default function NftDetailPage() {
  // Pega o ID da URL usando o TanStack Router
  const { id } = useParams({ from: '/nft/$id' });
  const [quantity, setQuantity] = useState(1);

  const { data: nft, isLoading, isError } = useQuery({
    queryKey: ["nft", id],
    queryFn: async () => {
      const response = await api.get<Nft>(`/api/nfts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2 lg:gap-16 lg:px-8 lg:py-16 animate-pulse">
        <div className="aspect-square w-full rounded-2xl bg-muted" />
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-12 w-3/4 rounded bg-muted" />
            <div className="h-6 w-1/2 rounded bg-muted" />
          </div>
          <div className="h-40 w-full rounded-xl bg-muted" />
          <div className="space-y-3">
            <div className="h-6 w-1/4 rounded bg-muted" />
            <div className="h-20 w-full rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !nft) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="font-display text-5xl tracking-wide">NFT não encontrado</p>
        <p className="text-muted-foreground">Esta obra pode ter sido removida ou o endereço está incorreto.</p>
        <Button asChild>
          <Link to="/">Voltar ao mercado</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2 lg:gap-16 lg:px-8 lg:py-16">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
        <img src={nft.image} alt={nft.title} className="aspect-square w-full object-cover" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Mercado
            </Link>{" "}
            / {nft.collection}
          </p>
          <h1 className="font-display text-5xl leading-none tracking-wide sm:text-6xl">{nft.title}</h1>
          <p className="text-sm text-muted-foreground">
            Criado por <span className="font-semibold text-foreground">{nft.creator}</span>
          </p>
        </div>

        <Card className="space-y-5 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Preço</p>
              <p className="font-display text-5xl tracking-wide text-primary">{formatEth(nft.price)}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {nft.editions} {nft.editions === 1 ? "edição disponível" : "edições disponíveis"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <QuantityControl value={quantity} max={nft.editions} onChange={setQuantity} />
            <AddToCartButton
              nft={nft}
              quantity={quantity}
              label="Adicionar ao Carrinho"
              size="lg"
              className="w-full sm:flex-1"
            />
          </div>
        </Card>

        <div className="space-y-3">
          <h2 className="font-display text-2xl tracking-wide">Sobre esta obra</h2>
          <p className="leading-relaxed text-muted-foreground">{nft.description}</p>
        </div>

        <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-6 text-sm">
          <div>
            <dt className="text-muted-foreground">Coleção</dt>
            <dd className="font-semibold">{nft.collection}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Rede</dt>
            <dd className="font-semibold">{nft.network}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Criado em</dt>
            <dd className="font-semibold">{formatDate(nft.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tipo</dt>
            <dd className="font-semibold">{nft.rare ? "Edição rara" : "Edição padrão"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}