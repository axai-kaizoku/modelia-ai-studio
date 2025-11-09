"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function LoginForm({ onSuccess, handleClose }: { onSuccess?: () => void; handleClose: () => void }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const loginSchema = z.object({
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
      loginSchema.parse(formData);
      setErrors({ email: "", password: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = { email: "", password: "" };
        error.errors.forEach((err) => {
          const field = err.path[0] as "email" | "password";
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      console.log(res);

      if (res?.error) {
        toast.error(res.error);
        setErrors((prev) => ({ ...prev, password: res.error ?? "Login failed" }));
        return;
      }

      router.push("/studio");
      router.refresh();
      handleClose?.();
      onSuccess?.();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-fit w-full flex-col gap-2 sm:gap-6 lg:gap-3 p-4">
      <header className="space-y-2 mb-2">
        <h1 className="font-satoshiMedium text-2xl text-black">Welcome 👋</h1>
        <p className="text-neutral-700 font-satoshiMedium text-sm">Enter your credentials to access your account</p>
      </header>

      <div>
        <Input
          id="email"
          type="email"
          autoFocus
          value={formData.email}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, email: e.target.value }));
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: "" }));
            }
          }}
          required
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
          required
          placeholder="Enter your password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        <ErrorMessage id="password-error" error={errors.password} />
      </div>

      <LoadingButton type="submit" size="sm" disabled={isLoading} loading={isLoading}>
        Sign in
      </LoadingButton>
    </form>
  );
}

interface ErrorMessageProps {
  id?: string;
  error: string;
  className?: string;
}

export function ErrorMessage({ id, error, className }: ErrorMessageProps) {
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
