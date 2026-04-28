import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Not found</h1>
      <p className="max-w-md text-muted-foreground">
        We couldn&apos;t find what you were looking for. It may have been
        deleted, or the link is wrong.
      </p>
      <Link href="/dashboard" className={buttonVariants()}>
        Go to dashboard
      </Link>
    </div>
  );
}
