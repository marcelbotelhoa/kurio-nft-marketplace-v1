import { useEffect, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Nft } from "@/data";

interface AddToCartButtonProps {
  nft: Nft;
  quantity?: number;
  label?: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function AddToCartButton({
  nft,
  quantity = 1,
  label = "Comprar",
  size = "default",
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timeout = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(timeout);
  }, [added]);

  const handleClick = () => {
    addItem(nft, quantity);
    setAdded(true);
  };

  return (
    <Button size={size} className={className} onClick={handleClick} aria-live="polite">
      {added ? (
        <>
          <Check />
          Adicionado
        </>
      ) : (
        <>
          <ShoppingCart />
          {label}
        </>
      )}
    </Button>
  );
}
