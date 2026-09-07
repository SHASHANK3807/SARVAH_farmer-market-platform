// components/lot/LotBadge.tsx
import { Badge } from "@/components/ui/badge";
import type { Grade } from "@/lib/types";

export function LotBadge({ grade }: { grade: Grade }) {
  const styles: Record<Grade, string> = {
    A: "bg-emerald-100 text-emerald-800 border-emerald-300",
    B: "bg-amber-100 text-amber-800 border-amber-300",
    C: "bg-slate-100 text-slate-800 border-slate-300",
  };

  return (
    <Badge variant="outline" className={`${styles[grade]} font-semibold`}>
      Grade {grade}
    </Badge>
  );
}
