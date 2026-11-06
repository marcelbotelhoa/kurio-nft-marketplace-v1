import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Nft } from "@/mocks/db"; // <-- Import atualizado

interface AddToCartButtonProps {
  nft: Nft;
  quantity?: number;
  label?: string;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function AddToCartButton({ 
  nft, 
  quantity = 1, 
  label = "Comprar", 
  size = "default",
  className 
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <Button 
      size={size} 
      className={className}
      onClick={(e) => {
        e.preventDefault(); // Evita que o link do card seja clicado
        addItem(nft, quantity);
      }}
    >
      <ShoppingCart className="mr-2 size-4" />
      {label}
    </Button>
  );
}