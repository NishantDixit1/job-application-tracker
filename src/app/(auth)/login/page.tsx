import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import Link from "next/link";

type SearchParams = Promise<{ callbackUrl?: string; error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  const { callbackUrl, error } = await searchParams;

  async function handleSignIn() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl ?? "/dashboard" });
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Welcome to JobTrack</CardTitle>
          <CardDescription>
            Sign in to start tracking your job applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              Sign-in failed. Please try again.
            </p>
          ) : null}
          <form action={handleSignIn}>
            <Button type="submit" className="w-full" size="lg">
              <GoogleIcon className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground">
            By signing in you agree to our terms of service.
          </p>
          <p className="text-center text-sm">
            <Link href="/" className="text-muted-foreground hover:underline">
              ← Back to home
            </Link>
          </p>
        </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.5 14.7 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}
