import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Sparkles, KanbanSquare, ShieldCheck } from "lucide-react";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            JobTrack
          </Link>
          <Link href="/login" className={buttonVariants({ size: "sm" })}>
            Sign in
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              AI-assisted job tracking
            </span>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              Stop losing track of your job applications.
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Paste a job posting, and JobTrack pulls out the company, role,
              location, and key requirements — so you can focus on landing the
              interview, not on data entry.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className={buttonVariants({ size: "lg" })}>
                Get started — it&apos;s free
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <Feature
              icon={<KanbanSquare className="h-5 w-5" />}
              title="Kanban + list views"
              body="See every application at a glance. Move things from Applied → Interviewing → Offer."
            />
            <Feature
              icon={<Sparkles className="h-5 w-5" />}
              title="AI autofill"
              body="Paste a job description. The form fills itself."
            />
            <Feature
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Private by default"
              body="Your data is yours. Sign in with Google. No public profiles."
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-2 flex items-center gap-2 font-medium">
        <span className="text-primary">{icon}</span>
        {title}
      </div>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
