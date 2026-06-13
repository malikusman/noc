import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Bot } from "lucide-react";
import type { AgentType } from "@/types";

/**
 * Restricted Agent = violet pill, Copilot Agent = blue pill.
 * Used consistently everywhere an agent appears to reinforce the
 * human-in-the-loop / restricted-agent trust model.
 */
export function AgentTypeBadge({
  type,
  className,
}: {
  type: AgentType;
  className?: string;
}) {
  if (type === "Copilot") {
    return (
      <Badge variant="info" className={className}>
        <Bot className="h-3 w-3" />
        Copilot Agent
      </Badge>
    );
  }
  return (
    <Badge variant="violet" className={className}>
      <ShieldCheck className="h-3 w-3" />
      Restricted Agent
    </Badge>
  );
}
