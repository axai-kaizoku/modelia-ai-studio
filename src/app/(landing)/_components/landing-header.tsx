"use client";
import { Button } from "@/components/ui/button";
import { useLoginDialog } from "@/hooks/use-login-dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export const LandingHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const { LoginDialogWithState, openDialog } = useLoginDialog();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn("fixed top-0 w-full z-30 text-background  transition-shadow duration-100", scrolled && "shadow-lg")}
    >
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between w-[92%] sm:w-[90%] 2xl:w-[88%] mx-auto py-4 gap-4">
        <Link prefetch={false} href="/" className="flex items-center gap-2 sm:gap-4 group shrink-0">
          <h1 className="text-2xl font-semibold">Modelia AI Studio</h1>
        </Link>

        <LoginDialogWithState />
        <div className="flex items-center gap-4 xl:gap-12 w-full md:w-auto">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <Button size="sm" variant="outline" onClick={openDialog} className="text-foreground">
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
