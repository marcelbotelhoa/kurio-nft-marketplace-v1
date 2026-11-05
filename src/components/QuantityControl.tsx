import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantityControlProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export function QuantityControl({ value, max, onChange }: QuantityControlProps) {
  return (
    <div className="inline-flex items-center rounded-md border border-border bg-background">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9"
        aria-label="Diminuir quantidade"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus />
      </Button>
      <span className="w-12 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9"
        aria-label="Aumentar quantidade"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus />
      </Button>
    </div>
  );
}
