"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ApplicationCard } from "@/components/application-card";
import { STATUSES, STATUS_LABELS, STATUS_COLORS } from "@/lib/validation";
import { updateApplicationStatus } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Application = {
  id: string;
  company: string;
  role: string;
  status: (typeof STATUSES)[number];
  location: string | null;
  jobUrl: string | null;
  appliedAt: Date;
};

export function KanbanBoard({ applications }: { applications: Application[] }) {
  const [pending, startTransition] = useTransition();
  const grouped = STATUSES.reduce(
    (acc, s) => {
      acc[s] = applications.filter((a) => a.status === s);
      return acc;
    },
    {} as Record<(typeof STATUSES)[number], Application[]>
  );

  function handleMove(id: string, status: (typeof STATUSES)[number]) {
    startTransition(async () => {
      const res = await updateApplicationStatus(id, status);
      if (!res.ok) toast.error(res.error);
    });
  }

  return (
    <div
      className="grid gap-4 md:grid-cols-3 xl:grid-cols-5"
      aria-busy={pending}
    >
      {STATUSES.map((s) => (
        <section
          key={s}
          aria-label={`${STATUS_LABELS[s]} column`}
          className="flex min-h-[200px] flex-col gap-3 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{STATUS_LABELS[s]}</h2>
            <Badge variant="outline" className={STATUS_COLORS[s]}>
              {grouped[s].length}
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            {grouped[s].length === 0 ? (
              <p className="text-xs text-muted-foreground">Nothing here yet.</p>
            ) : (
              grouped[s].map((a) => (
                <div key={a.id} className="space-y-2">
                  <ApplicationCard application={a} compact />
                  <Select
                    value={a.status}
                    onValueChange={(v) =>
                      handleMove(a.id, v as (typeof STATUSES)[number])
                    }
                  >
                    <SelectTrigger size="sm" aria-label="Change status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          Move to {STATUS_LABELS[opt]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
