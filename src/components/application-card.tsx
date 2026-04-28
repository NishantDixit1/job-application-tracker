import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Calendar } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/validation";
import { format } from "date-fns";

type Application = {
  id: string;
  company: string;
  role: string;
  status: keyof typeof STATUS_LABELS;
  location: string | null;
  jobUrl: string | null;
  appliedAt: Date;
};

export function ApplicationCard({
  application,
  compact = false,
}: {
  application: Application;
  compact?: boolean;
}) {
  return (
    <div className="group relative rounded-lg border bg-card p-4 transition-colors hover:bg-accent/40 focus-within:bg-accent/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">
              <Link
                href={`/applications/${application.id}`}
                className="outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring"
              >
                {application.company}
              </Link>
            </h3>
            {application.jobUrl ? (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 text-muted-foreground hover:text-foreground"
                aria-label="Open job posting"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {application.role}
          </p>
          {!compact ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-muted-foreground">
              {application.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {application.location}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(application.appliedAt, "MMM d, yyyy")}
              </span>
            </div>
          ) : null}
        </div>
        {!compact ? (
          <Badge
            variant="outline"
            className={STATUS_COLORS[application.status]}
          >
            {STATUS_LABELS[application.status]}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}
