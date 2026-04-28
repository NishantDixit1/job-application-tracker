import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Inbox } from "lucide-react";
import { ApplicationCard } from "@/components/application-card";
import { KanbanBoard } from "@/components/kanban-board";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ view?: string }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { view } = await searchParams;
  const defaultTab = view === "list" ? "list" : "kanban";

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { appliedAt: "desc" },
    select: {
      id: true,
      company: true,
      role: true,
      status: true,
      location: true,
      jobUrl: true,
      appliedAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Your applications
          </h1>
          <p className="text-sm text-muted-foreground">
            {applications.length === 0
              ? "Track every role you apply to."
              : `${applications.length} ${
                  applications.length === 1 ? "application" : "applications"
                } tracked.`}
          </p>
        </div>
        <Link
          href="/applications/new"
          className={buttonVariants()}
        >
          <Plus className="mr-2 h-4 w-4" />
          New application
        </Link>
      </div>

      {applications.length === 0 ? (
        <EmptyState />
      ) : (
        <Tabs defaultValue={defaultTab}>
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          <TabsContent value="kanban" className="pt-4">
            <KanbanBoard applications={applications} />
          </TabsContent>
          <TabsContent value="list" className="pt-4">
            <div className="grid gap-3">
              {applications.map((a) => (
                <ApplicationCard key={a.id} application={a} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/30 px-6 py-16 text-center">
      <div className="rounded-full bg-background p-3 shadow-sm">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <h2 className="font-semibold">No applications yet</h2>
        <p className="text-sm text-muted-foreground">
          Add your first application — paste a job description and let AI fill
          in the details.
        </p>
      </div>
      <Link
        href="/applications/new"
        className={buttonVariants()}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add your first application
      </Link>
    </div>
  );
}
