import { Button } from "@/components/ui/button";

const HERO_IMAGE = "/macaco-1.png"; 

export function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20 lg:px-8">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Bem-vindo à Kurio
        </p>
        <h1 className="font-display text-5xl leading-none tracking-wide sm:text-6xl lg:text-7xl">
          SEJA DONO DO FUTURO DA ARTE DIGITAL
        </h1>
        <p className="max-w-md text-base text-muted-foreground">
          Descubra NFTs selecionados de criadores independentes e colecione obras com autenticidade
          verificada.
        </p>
        <Button asChild size="lg">
          <a href="#mercado">Explorar</a>
        </Button>
      </div>
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/50">
        <img
          src={HERO_IMAGE}
          alt="Obra em destaque da coleção Kurio"
          className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
    </section>
  );
}