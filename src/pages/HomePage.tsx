import { useMemo, useState } from "react";
import { useSearch } from "@tanstack/react-router"; // <-- Novo Hook
import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/Hero";
import { FilterSidebar, DEFAULT_FILTERS, type NftFilters } from "@/components/FilterSidebar";
import { NftCard } from "@/components/NftCard";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { api } from "@/lib/api";
import type { Nft } from "@/mocks/db";

type SortOption = "recent" | "price-asc" | "price-desc";

export default function HomePage() {
  // Pega o parâmetro 'q' da URL usando o TanStack Router
  const { q: query = "" } = useSearch({ from: '/' });
  
  const [filters, setFilters] = useState<NftFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("recent");

  const { data: nfts = [], isLoading, isError } = useQuery({
    queryKey: ["nfts"],
    queryFn: async () => {
      const response = await api.get<Nft[]>("/api/nfts");
      return response.data;
    },
  });

  const results = useMemo(() => {
    const term = query.toLowerCase();
    return nfts
      .filter((nft) => {
        if (term && ![nft.title, nft.creator, nft.collection].some((text) => text.toLowerCase().includes(term))) {
          return false;
        }
        if (filters.collection && nft.collection !== filters.collection) return false;
        if (nft.price > filters.maxPrice) return false;
        if (filters.networks.length > 0 && !filters.networks.includes(nft.network)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [nfts, query, filters, sort]);

  return (
    <>
      <Hero />

      <section id="mercado" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <FilterSidebar filters={filters} onChange={setFilters} />

          <div className="min-w-0 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <h2 className="font-display text-4xl tracking-wide">
                  {query ? `Resultados para "${query}"` : "Listados recentemente"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Carregando..." : `${results.length} ${results.length === 1 ? "NFT encontrado" : "NFTs encontrados"}`}
                </p>
              </div>
              <div className="w-full sm:w-56">
                <Select
                  aria-label="Ordenar por"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                >
                  <option value="recent">Listados recentemente</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3 rounded-xl border border-border p-4 animate-pulse">
                    <div className="aspect-square w-full rounded-lg bg-muted" />
                    <div className="h-6 w-2/3 rounded bg-muted" />
                    <div className="h-4 w-1/2 rounded bg-muted" />
                    <div className="mt-4 flex items-center justify-between">
                      <div className="h-6 w-16 rounded bg-muted" />
                      <div className="h-9 w-24 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
                Erro ao carregar os NFTs. Tente novamente mais tarde.
              </div>
            ) : results.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((nft) => (
                  <NftCard key={nft.id} nft={nft as any} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-16 text-center">
                <p className="font-display text-3xl tracking-wide">Nenhum NFT encontrado</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Tente outro termo de busca ou ajuste os filtros.
                </p>
                <Button variant="outline" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}