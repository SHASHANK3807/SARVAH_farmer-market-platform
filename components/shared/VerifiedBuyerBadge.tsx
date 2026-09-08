// components/shared/VerifiedBuyerBadge.tsx
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

export function VerifiedBuyerBadge() {
  const t = useTranslations("badges");
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 gap-1 cursor-help hover:bg-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-700" />
            {t("verified")}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="text-balance max-w-xs">
          {t("verifiedTooltip")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
