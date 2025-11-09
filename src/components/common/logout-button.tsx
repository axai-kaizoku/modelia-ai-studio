"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  return (
    <Button onClick={() => signOut({ redirectTo: "/", redirect: true })}>
      Logout
      <LogOut />
    </Button>
  );
};
