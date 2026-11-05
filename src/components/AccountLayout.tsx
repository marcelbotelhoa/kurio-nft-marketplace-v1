import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { CreditCard, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const ACCOUNT_LINKS = [
  { label: "Dados do perfil", to: "/profile", icon: User },
  { label: "Carteiras", to: "/wallets", icon: CreditCard },
];

export function AccountLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" }); 
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[240px_1fr] lg:px-8">
      <Card className="h-fit p-3">
        <p className="px-3 pb-3 pt-2 font-display text-2xl tracking-wide">Meu perfil</p>
        <nav className="flex flex-col gap-1">
          {ACCOUNT_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ 
                className: "bg-accent text-primary" 
              }}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}
          <Button variant="ghost" className="justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Sair
          </Button>
        </nav>
      </Card>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}