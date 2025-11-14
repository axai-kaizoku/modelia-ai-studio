import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // If not logged in, just render the landing page
  if (!session) {
    return <>{children}</>;
  }

  // User is fully set up, redirect to products
  redirect("/studio");
}
