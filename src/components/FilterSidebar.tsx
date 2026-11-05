import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, NFTS, type Network } from "@/data";
import { formatEth } from "@/lib/format";
import { cn } from "@/lib/utils";

export const MAX_PRICE_LIMIT = 3;
const NETWORKS: Network[] = ["Ethereum", "Polygon", "Solana"];

export interface NftFilters {
  collection: string | null;
  maxPrice: number;
  networks: Network[];
}

export const DEFAULT_FILTERS: NftFilters = {
  collection: null,
  maxPrice: MAX_PRICE_LIMIT,
  networks: [],
};

interface FilterSidebarProps {
  filters: NftFilters;
  onChange: (filters: NftFilters) => void;
}

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const collectionCount = (name: string) => NFTS.filter((nft) => nft.collection === name).length;
  const networkCount = (network: Network) => NFTS.filter((nft) => nft.network === network).length;

  const toggleNetwork = (network: Network) => {
    const networks = filters.networks.includes(network)
      ? filters.networks.filter((item) => item !== network)
      : [...filters.networks, network];
    onChange({ ...filters, networks });
  };

  return (
    <Card className="h-fit space-y-8 p-6 lg:sticky lg:top-24">
      <div className="space-y-3">
        <h2 className="font-display text-2xl tracking-wide">Coleções</h2>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onChange({ ...filters, collection: null })}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
                filters.collection === null ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Todas
              <span className="tabular-nums">{NFTS.length}</span>
            </button>
          </li>
          {COLLECTIONS.map((name) => {
            const count = collectionCount(name);
            const active = filters.collection === name;
            return (
              <li key={name}>
                <button
                  type="button"
                  disabled={count === 0}
                  onClick={() => onChange({ ...filters, collection: active ? null : name })}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {name}
                  <span className="tabular-nums">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-2xl tracking-wide">Faixa de preço</h2>
        <input
          type="range"
          min={0}
          max={MAX_PRICE_LIMIT}
          step={0.01}
          value={filters.maxPrice}
          onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })}
          aria-label="Preço máximo"
          className="w-full accent-primary"
        />
        <p className="text-sm text-muted-foreground">
          Até <span className="font-semibold text-foreground">{formatEth(filters.maxPrice)}</span>
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-2xl tracking-wide">Rede</h2>
        <ul className="space-y-2">
          {NETWORKS.map((network) => (
            <li key={network}>
              <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.networks.includes(network)}
                    onChange={() => toggleNetwork(network)}
                    className="size-4 accent-primary"
                  />
                  {network}
                </span>
                <span className="tabular-nums">{networkCount(network)}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={() => onChange(DEFAULT_FILTERS)}>
        Limpar filtros
      </Button>
    </Card>
  );
}
