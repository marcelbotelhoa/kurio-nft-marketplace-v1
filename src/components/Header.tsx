import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Início", to: "/", hash: undefined },
  { label: "Mercado", to: "/", hash: "mercado" },
];

function SearchForm({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    navigate({ 
      to: "/", 
      search: term ? { q: term } : undefined, 
      hash: "mercado" 
    } as any);
  };

  return (
    <form onSubmit={handleSubmit} role="search" className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar NFTs, criadores..."
        aria-label="Buscar NFTs"
        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      />
    </form>
  );
}

function CartLink() {
  const { itemCount } = useCart();
  return (
    <Link
      to="/cart"
      aria-label={`Carrinho com ${itemCount} itens`}
      className="relative inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-primary"
    >
      <ShoppingCart className="size-5" />
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold leading-5 text-primary-foreground">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
        <Link to="/" className="font-display text-3xl tracking-[0.2em] text-foreground">
          KURIO
        </Link>

        <nav className="ml-8 hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              hash={item.hash}
              activeProps={{ className: "text-primary" }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchForm className="hidden w-56 lg:block" />
          <CartLink />
          {user ? (
            <div className="hidden items-center gap-1 md:flex">
              <Button asChild variant="ghost" size="sm">
                <Link to="/profile">
                  <User className="mr-2 size-4" />
                  {(user as any).username || user.name}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Sair" onClick={handleLogout}>
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link to="/login">
                <User className="mr-2 size-4" />
                Entrar
              </Link>
            </Button>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Menu</SheetTitle>
              <SearchForm />
              <nav className="flex flex-col gap-4 mt-6">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    hash={item.hash}
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                >
                  Carrinho
                </Link>
              </nav>
              <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6">
                {user ? (
                  <>
                    <Button asChild variant="outline" onClick={() => setMenuOpen(false)}>
                      <Link to="/profile">Meu perfil</Link>
                    </Button>
                    <Button variant="ghost" onClick={handleLogout}>
                      <LogOut className="mr-2 size-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button asChild onClick={() => setMenuOpen(false)}>
                    <Link to="/login">Entrar</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}