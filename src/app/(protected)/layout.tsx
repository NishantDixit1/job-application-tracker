import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <Nav user={session.user} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
