
import { socket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function RealtimeSimulator() {
  const triggerNftUpdate = () => {
    const newPrice = Number(
      (Math.random() * 2 + 0.5).toFixed(2)
    );

    const nft = {
      id: "emerald-ape-042",
      title: "Emerald Ape #042",
      price: newPrice,
      creator: "Kurio Studio",
      collection: "Arte digital",
      network: "Ethereum",
      image: "/macaco-1.png",
      description:
        "Um macaco elegante com óculos de sol e jaqueta verde.",
      editions: 10,
      createdAt: 1767225600000,
      version: Date.now(),
    };

    console.log("📤 Enviando atualização:", nft);

    if (!socket.connected) {
      console.error("🔴 Socket não está conectado!");
      socket.connect();
      return;
    }

    socket.emit("nft.updated", nft);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-2xl">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
        🛠️ Simulador Backend
      </p>

      <Button
        size="sm"
        onClick={triggerNftUpdate}
        className="gap-2"
      >
        <Zap className="size-4" />
        Mudar Preço (NFT 1)
      </Button>
    </div>
  );
}
