import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MainNav } from "@/components/layout/MainNav";

export default async function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  return (
    <div>
      <MainNav isLoggedIn={true} />
      {children}
    </div>
  );
}
