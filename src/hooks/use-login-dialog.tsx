"use client";
import { useState } from "react";
import { LoginDialog } from "@/components/common/login-dialog";

export function useLoginDialog() {
  const [open, setOpen] = useState(false);

  const LoginDialogWithState = () => <LoginDialog open={open} setOpen={setOpen} />;

  return { openDialog: () => setOpen(true), LoginDialogWithState };
}
