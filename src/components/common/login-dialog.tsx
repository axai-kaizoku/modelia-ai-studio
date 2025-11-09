"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginForm from "./login-form";
import { useState } from "react";
import SignupForm from "./signup-form";

export const LoginDialog = ({
  open,
  setOpen,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}) => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="sm:max-w-3xl h-[24rem] p-2 rounded-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Login Dialog</DialogTitle>
          <DialogDescription>Login into your account</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 w-full gap-4">
          <div className="col-span-1">
            <img src="/login-form.webp" width={480} height={480} alt="login" className="object-contain rounded-xl" />
            {/* <div className="p-2 w-full h-full bg-amber-100 rounded-xl"></div> */}
          </div>
          <div className="col-span-1 w-full flex justify-end items-center">
            <div className="w-full h-fit flex items-center justify-center">
              <div className="w-full">
                {isLogin ? (
                  <LoginForm onSuccess={onSuccess} handleClose={() => setOpen(false)} />
                ) : (
                  <SignupForm handleClose={() => setOpen(false)} onSuccess={onSuccess} />
                )}
                <div>
                  {isLogin ? (
                    <div className="w-full flex justify-center items-center">
                      <p className="text-sm text-gray-500">
                        Don't have an account?{" "}
                        <button type="button" className="text-primary cursor-pointer" onClick={() => setIsLogin(false)}>
                          Sign up
                        </button>
                      </p>
                    </div>
                  ) : (
                    <div className="w-full flex justify-center items-center">
                      <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <button type="button" className="text-primary cursor-pointer" onClick={() => setIsLogin(true)}>
                          Login
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
