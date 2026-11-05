import { Link } from "@tanstack/react-router";

const FOOTER_COLUMNS = [
  {
    title: "Minha conta",
    links: [
      { label: "Meu perfil", to: "/profile" },
      { label: "Carteiras", to: "/wallets" },
      { label: "Carrinho", to: "/cart" },
    ],
  },
  {
    title: "Mercado",
    links: [
      { label: "Explorar NFTs", to: "/#mercado" },
      { label: "Entrar", to: "/login" },
      { label: "Criar conta", to: "/signup" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="font-display text-3xl tracking-[0.2em]">KURIO</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Marketplace de NFTs com obras de criadores independentes e autenticidade verificada na
            blockchain.
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} className="space-y-4">
            <h4 className="font-display text-xl tracking-wide">{column.title}</h4>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Kurio. Todos os direitos reservados.
      </div>
    </footer>
  );
}
