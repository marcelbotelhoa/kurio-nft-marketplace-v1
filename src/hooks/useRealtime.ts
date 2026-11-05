
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import type { Nft } from "@/mocks/db";

export function useRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Atualização de NFT recebida pelo Socket
    const handleNftUpdated = (data: Nft) => {
      console.log("🔥 Socket event: nft.updated", data);

      // Atualiza a lista de NFTs
      queryClient.setQueryData<Nft[]>(["nfts"], (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((nft) => {
          if (nft.id === data.id) {
            return nft.version < data.version ? data : nft;
          }

          return nft;
        });
      });

      // Atualiza o NFT individual
      queryClient.setQueryData<Nft>(
        ["nft", data.id],
        (oldData) => {
          if (!oldData) return oldData;

          return oldData.version < data.version ? data : oldData;
        }
      );

      // Atualiza informações dependentes
      queryClient.invalidateQueries({
        queryKey: ["quote"],
      });
    };

    // Atualização de pedidos
    const handleOrderUpdated = (data: unknown) => {
      console.log("🔥 Socket event: order.updated", data);

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    };

    // Conexão estabelecida
    const handleConnect = () => {
      console.log("🟢 Socket conectado!");

      queryClient.invalidateQueries({
        queryKey: ["nfts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["quote"],
      });
    };

    // Erros de conexão
    const handleConnectError = (error: Error) => {
      console.error("🔴 Erro no Socket:", error.message);
    };

    // Registra os eventos
    socket.on("nft.updated", handleNftUpdated);
    socket.on("order.updated", handleOrderUpdated);
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);

    // Conecta o socket
    if (!socket.connected) {
      socket.connect();
    }

    // Limpeza dos eventos
    return () => {
      socket.off("nft.updated", handleNftUpdated);
      socket.off("order.updated", handleOrderUpdated);
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [queryClient]);
}
