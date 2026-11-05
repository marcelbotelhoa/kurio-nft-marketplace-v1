import { useEffect, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router"; // <-- Importando do TanStack
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function ScrollToTop() {
  // O TanStack Router também tem o useLocation e ele retorna pathname e hash
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

// Agora o Layout aceita children (as páginas vão entrar aqui)
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        {children} {/* <-- Trocamos o Outlet por children */}
      </main>
      <Footer />
    </div>
  );
}