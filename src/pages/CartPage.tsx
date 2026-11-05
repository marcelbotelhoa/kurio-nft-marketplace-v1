import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router"; // <-- TanStack
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { QuantityControl } from "@/components/QuantityControl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/lib/api";
import { formatEth } from "@/lib/format";

export default function CartPage() {
  const { items, couponCode, updateQuantity, removeItem, setCouponCode, removeCoupon } = useCart();
  const [inputCoupon, setInputCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  const { data: quote, isLoading } = useQuery({
    queryKey: ["quote", items.map(i => ({ id: i.nft.id, q: i.quantity })), couponCode],
    queryFn: async () => {
      if (items.length === 0) return null;
      const payload = {
        items: items.map(i => ({ id: i.nft.id, quantity: i.quantity })),
        couponCode: couponCode || undefined,
      };
      const response = await api.post("/api/quote", payload);
      return response.data;
    },
    enabled: items.length > 0,
  });

  const handleApplyCoupon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponCode(inputCoupon.trim().toUpperCase());
    setCouponError("");
    setInputCoupon("");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="size-12 text-primary" />
        <p className="font-display text-5xl tracking-wide">Seu carrinho está vazio</p>
        <p className="text-muted-foreground">Explore o mercado e adicione as obras que você quer colecionar.</p>
        <Button asChild>
          <Link to="/" hash="mercado">Explorar NFTs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
      <h1 className="font-display text-5xl tracking-wide">Carrinho</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "obra" : "obras"} no seu carrinho
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {items.map(({ nft, quantity }) => (
            <li key={nft.id}>
              <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Link to="/nft/$id" params={{ id: nft.id }} className="shrink-0">
                  <img
                    src={nft.image}
                    alt={nft.title}
                    className="size-24 rounded-lg object-cover transition-transform hover:scale-105"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to="/nft/$id" params={{ id: nft.id }} className="font-semibold transition-colors hover:text-primary">
                    {nft.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{nft.creator}</p>
                  <p className="mt-1 text-sm text-primary">{formatEth(nft.price)}</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <QuantityControl
                    value={quantity}
                    max={nft.editions}
                    onChange={(value) => updateQuantity(nft.id, value)}
                  />
                  <p className="w-28 text-right font-semibold tabular-nums">
                    {formatEth(nft.price * quantity)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remover ${nft.title}`}
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(nft.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        <aside className="h-fit space-y-6">
          <Card className="space-y-4 p-6">
            <h2 className="font-display text-2xl tracking-wide">Cupom de desconto</h2>
            
            {couponCode ? (
              <div className="flex items-center justify-between rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 font-semibold">
                  <Tag className="size-4 text-success" />
                  {couponCode}
                </span>
                <Button variant="ghost" size="icon" className="size-7" aria-label="Remover cupom" onClick={removeCoupon}>
                  <X />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2" noValidate>
                <div className="flex gap-2">
                  <Input
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Código do cupom"
                    aria-label="Código do cupom"
                  />
                  <Button type="submit" variant="secondary">
                    Aplicar
                  </Button>
                </div>
                {couponError && <p className="text-sm text-destructive">{couponError}</p>}
              </form>
            )}
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-display text-2xl tracking-wide">Resumo</h2>
            
            {isLoading || !quote ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-8 w-full bg-muted rounded mt-4"></div>
              </div>
            ) : (
              <>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="tabular-nums">{formatEth(Number(quote.subtotal))}</dd>
                  </div>
                  {quote.coupon && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Desconto</dt>
                      <dd className="tabular-nums text-success">- {formatEth(Number(quote.discount))}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Taxa de rede</dt>
                    <dd className="tabular-nums">{formatEth(Number(quote.fee))}</dd>
                  </div>
                </dl>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-3xl tracking-wide text-primary">{formatEth(Number(quote.total))}</span>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link to="/checkout">Ir para o Checkout</Link>
                </Button>
              </>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}