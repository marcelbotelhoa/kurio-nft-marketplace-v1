import { Link } from "@tanstack/react-router"; // <-- TanStack
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-display text-7xl tracking-wide text-primary">404</h1>
      <h2 className="font-display text-4xl tracking-wide">Página não encontrada</h2>
      <p className="max-w-md text-muted-foreground">
        O link que você tentou acessar não existe ou foi movido.
      </p>
      <Button asChild size="lg">
        <Link to="/">Voltar para a Home</Link>
      </Button>
    </div>
  );
}