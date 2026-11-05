import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router"; // <-- TanStack
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, Wallet as WalletIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { WALLETS, type Wallet } from "@/data";
import { api } from "@/lib/api";
import { formatEth } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, couponCode, clear } = useCart();
  const [wallet, setWallet] = useState<Wallet>(WALLETS[0]);
  const [order, setOrder] = useState<any>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const { data: quote, isLoading: isQuoteLoading } = useQuery({
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

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        items: items.map(i => ({ id: i.nft.id, quantity: i.quantity })),
        total: quote.total,
      };
      const response = await api.post("/api/orders", payload, {
        headers: { "Idempotency-Key": idempotencyKey },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setOrder(data);
      clear();
    },
  });

  const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!quote) return;
    mutation.mutate();
  };

  const handleCloseConfirmation = () => {
    setOrder(null);
    navigate({ to: "/" }); // <-- Navegação TanStack
  };

  if (items.length === 0 && !order) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="font-display text-5xl tracking-wide">Nada para pagar</p>
        <p className="text-muted-foreground">Adicione NFTs ao carrinho antes de finalizar a compra.</p>
        <Button asChild>
          <Link to="/" hash="mercado">Explorar NFTs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
      <h1 className="font-display text-5xl tracking-wide">Pagamento</h1>
      <p className="mb-8 text-sm text-muted-foreground">Preencha seus dados e escolha a carteira de pagamento.</p>

      <form onSubmit={handleConfirm} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <h2 className="font-display text-2xl tracking-wide">Dados do comprador</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="checkout-name">Nome completo</Label>
                <Input id="checkout-name" name="name" required placeholder="Seu nome completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout-email">E-mail</Label>
                <Input id="checkout-email" name="email" type="email" required placeholder="voce@email.com" />
              </div>
            </div>
          </Card>

          <Card className="space-y-5 p-6">
            <h2 className="font-display text-2xl tracking-wide">Carteira de pagamento</h2>
            <div className="grid gap-3" role="radiogroup" aria-label="Carteira de pagamento">
              {WALLETS.map((item) => {
                const selected = item.id === wallet.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setWallet(item)}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border p-4 text-left transition-all hover:border-primary/60",
                      selected ? "border-primary bg-primary/5" : "border-border bg-background",
                    )}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                      <WalletIcon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{item.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {item.type} · {item.address}
                      </span>
                    </span>
                    <span className={cn("size-4 rounded-full border-2 transition-colors", selected ? "border-primary bg-primary" : "border-muted-foreground")} />
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <Card className="h-fit space-y-5 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl tracking-wide">Resumo do pedido</h2>
          
          {isQuoteLoading || !quote ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-10 w-full bg-muted rounded"></div>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {items.map(({ nft, quantity }) => (
                  <li key={nft.id} className="flex items-center gap-3">
                    <img src={nft.image} alt="" className="size-12 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{nft.title}</p>
                      <p className="text-xs text-muted-foreground">x {quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-3 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatEth(Number(quote.subtotal))}</dd>
                </div>
                {quote.coupon && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Cupom {quote.coupon.code}</dt>
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
            </>
          )}

          {mutation.isError && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              Erro ao processar pagamento. Tente novamente.
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending || isQuoteLoading || !quote}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Confirmar Pedido"
            )}
          </Button>
        </Card>
      </form>

      <Dialog open={order !== null} onOpenChange={(open) => !open && handleCloseConfirmation()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="items-center text-center">
            <CheckCircle2 className="size-12 text-success" />
            <DialogTitle>Seus NFTs já estão na carteira</DialogTitle>
            <DialogDescription>Compra concluída com sucesso.</DialogDescription>
          </DialogHeader>

          <dl className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-background p-4 text-sm">
            <div>
              <dt className="text-muted-foreground">ID do Pedido</dt>
              <dd className="truncate font-mono text-xs">{order?.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="uppercase text-success font-bold">{order?.status}</dd>
            </div>
          </dl>

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between font-semibold">
              <span>Total Pago</span>
              <span className="font-display text-2xl tracking-wide text-primary">
                {formatEth(Number(order?.total ?? 0))}
              </span>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleCloseConfirmation}>
            Voltar para o mercado
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}