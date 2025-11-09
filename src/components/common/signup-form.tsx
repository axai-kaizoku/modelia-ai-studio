"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { toast } from "sonner";

import { LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { signup } from "@/server/api/login/actions";

interface ErrorMessageProps {
  id?: string;
  error: string;
  className?: string;
}

function ErrorMessage({ id, error, className }: ErrorMessageProps) {
  return (
    <p
      id={id}
      className={cn(
        error ? "opacity-100" : "opacity-0",
        "text-destructive/90 h-2 mt-0 text-xs text-right font-gilroyMedium",
        className
      )}
      role={error ? "alert" : undefined}
      aria-live="polite"
    >
      {error}
    </p>
  );
}

export default function SignupForm({ onSuccess, handleClose }: { onSuccess?: () => void; handleClose: () => void }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const signupMutation = useMutation({
    mutationFn: signup,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(20, "Name must be atmost 20 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
        message: "Password must contain at least 1 letter and 1 number",
      }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      signupSchema.parse(formData);
      setErrors({ name: "", email: "", password: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = { name: "", email: "", password: "" };
        error.errors.forEach((err) => {
          const field = err.path[0] as "name" | "email" | "password";
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    try {
      const { name, email, password } = formData;
      const res = await signupMutation.mutateAsync({ email, name, password });

      if (res.error) {
        toast.error(res.message ?? "Registration failed");
        setErrors((prev) => ({ ...prev, email: res.message ?? "Registration failed" }));
        return;
      }

      const loadingToastId = toast.loading("Account created successfully! Logging you in...");

      const signInRes = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (signInRes?.error) {
        toast.error("Account created but login failed. Please try logging in manually.", { id: loadingToastId });
        return;
      }

      toast.success("Login successful!", { id: loadingToastId });

      router.push("/studio");
      router.refresh();
      handleClose?.();
      onSuccess?.();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-fit w-full flex-col gap-2 sm:gap-6 lg:gap-3 p-4">
      <header className="space-y-2 mb-2">
        <h1 className="font-satoshiMedium text-2xl text-black">Create Account 🚀</h1>
        <p className="text-neutral-700 font-satoshiMedium text-sm">Sign up to get started</p>
      </header>

      <div>
        <Input
          id="name"
          type="text"
          autoFocus
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: "" }));
            }
          }}
          placeholder="Enter your name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        <ErrorMessage id="name-error" error={errors.name} />
      </div>

      <div>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, email: e.target.value }));
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: "" }));
            }
          }}
          placeholder="Enter your email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        <ErrorMessage id="email-error" error={errors.email} />
      </div>

      <div>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, password: e.target.value }));
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: "" }));
            }
          }}
          placeholder="Enter your password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        <ErrorMessage id="password-error" error={errors.password} />
      </div>

      <LoadingButton type="submit" size="sm" disabled={isLoading} loading={isLoading}>
        Create Account
      </LoadingButton>
    </form>
  );
}
