"use client";

import { Button } from "@/components/ui/button";
import { useLoginDialog } from "@/hooks/use-login-dialog";

export const LandingHero = () => {
  const { LoginDialogWithState, openDialog } = useLoginDialog();

  return (
    <div className="h-screen w-full bg-gradient-to-b from-black">
      <div className="grid grid-cols-4 h-full relative">
        <div className="col-span-3 flex items-center justify-start  h-full w-full ">
          <div className="mx-auto flex flex-col w-[92%] sm:w-[87%] 2xl:w-[84%]">
            <h1 className="font-satoshiBold text-neutral-50 text-5xl 2xl:text-6xl leading-tight">
              Transform
              <br />
              Your model
            </h1>
            <p className="font-satoshiMedium text-2xl  2xl:text-3xl text-neutral-50 my-8">
              Very very Fast
              <br /> Easy.
            </p>
            <LoginDialogWithState />
            <Button type="button" variant="secondary" size="lg" onClick={openDialog} className="w-fit">
              Explore
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
