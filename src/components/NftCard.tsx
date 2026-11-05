import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatEth } from "@/lib/format";
import type { Nft } from "@/mocks/db"; // <-- Import atualizado

export function NftCard({ nft }: { nft: Nft }) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-black/40">
      <Link
        to="/nft/$id"
        params={{ id: nft.id }}
        className="relative block aspect-square overflow-hidden bg-secondary"
      >
        <img
          src={nft.image}
          alt={nft.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {nft.rare && (
          <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-0.5 font-display text-base tracking-wider text-primary-foreground">
            RARO
          </span>
        )}
      </Link>
      <div className="space-y-3 p-4">
        <div className="min-w-0">
          <Link
            to="/nft/$id"
            params={{ id: nft.id }}
            className="block truncate font-semibold text-foreground transition-colors hover:text-primary"
          >
            {nft.title}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{nft.creator}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-primary">{formatEth(nft.price)}</span>
          <AddToCartButton nft={nft} size="sm" />
        </div>
      </div>
    </Card>
  );
}