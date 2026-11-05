// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Não recarrega toda vez que a janela ganha foco
      retry: 1, // Tenta de novo 1 vez se falhar
      staleTime: 1000 * 60 * 5, // Considera os dados "frescos" por 5 minutos
    },
  },
});