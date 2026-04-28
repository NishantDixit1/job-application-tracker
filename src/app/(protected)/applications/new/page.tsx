import Link from "next/link";
import { ApplicationForm } from "@/components/application-form";
import { ChevronLeft } from "lucide-react";

export default function NewApplicationPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Add an application
        </h1>
        <p className="text-sm text-muted-foreground">
          Paste a job posting to autofill, or enter details manually.
        </p>
      </div>
      <ApplicationForm mode={{ kind: "create" }} />
    </div>
  );
}
