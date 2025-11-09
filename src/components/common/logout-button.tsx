"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export const LogoutButton = () => {
  return <Button onClick={() => signOut({ redirectTo: "/", redirect: true })}>Logout</Button>;
};
