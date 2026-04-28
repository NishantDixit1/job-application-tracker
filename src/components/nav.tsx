import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";

type NavUser = { name?: string | null; email?: string | null; image?: string | null };

export function Nav({ user }: { user: NavUser }) {
  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  const initials = (user.name ?? user.email ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          JobTrack
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/applications/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="mr-1 h-4 w-4" />
            New
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Account menu"
              className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Avatar className="h-8 w-8">
                {user.image ? <AvatarImage src={user.image} alt="" /> : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col px-2 py-1.5 text-sm">
                <span className="font-medium">{user.name ?? "Signed in"}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <DropdownMenuSeparator />
              <form action={handleSignOut} className="p-1">
                <button
                  type="submit"
                  className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1.5 text-sm text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:outline-none"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
