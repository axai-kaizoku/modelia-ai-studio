import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";

export const metadata: Metadata = {
  title: "BCG",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // If not logged in, just render the landing page
  if (!session) {
    return <>{children}</>;
  }

  // User is fully set up, redirect to products
  redirect("/dashboard");
}
