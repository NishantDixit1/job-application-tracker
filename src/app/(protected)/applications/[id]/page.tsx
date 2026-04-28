import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { format } from "date-fns";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApplicationForm } from "@/components/application-form";
import { DeleteApplicationButton } from "@/components/delete-application-button";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/validation";

type Params = Promise<{ id: string }>;

export default async function ApplicationDetailPage({
  params,
}: {
  params: Params;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!application) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <DeleteApplicationButton id={application.id} company={application.company} />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {application.company}
          </h1>
          <Badge
            variant="outline"
            className={STATUS_COLORS[application.status]}
          >
            {STATUS_LABELS[application.status]}
          </Badge>
          {application.jobUrl ? (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              View posting <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </div>
        <p className="text-muted-foreground">
          {application.role}
          {application.location ? ` · ${application.location}` : ""}
          {` · Applied ${format(application.appliedAt, "MMM d, yyyy")}`}
        </p>
      </div>

      <ApplicationForm
        mode={{ kind: "edit", id: application.id }}
        defaults={{
          company: application.company,
          role: application.role,
          status: application.status,
          jobUrl: application.jobUrl ?? "",
          location: application.location ?? "",
          salary: application.salary ?? "",
          notes: application.notes ?? "",
        }}
      />
    </div>
  );
}
