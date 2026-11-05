import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { queryClient } from "./lib/queryClient";
import { routeTree } from "./routeTree.gen"; // <-- O Vite cria esse arquivo sozinho
import "./index.css";

// Cria a instância do Roteador do TanStack
const router = createRouter({ routeTree });

// Avisa o TypeScript sobre os tipos das rotas
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Função para ligar o MSW
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    return worker.start({ onUnhandledRequest: "bypass" } as any);
  }
}

// Inicia o MSW e renderiza o React
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
});