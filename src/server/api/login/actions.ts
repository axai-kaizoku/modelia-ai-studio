"use server";

import { env } from "@/env";
import { callAPI } from "@/server/helper";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  message?: string;
  user: User;
};

export async function signup({ email, name, password }: { email: string; password: string; name: string }) {
  const apiUrl = `${env.BASEURL_API}/v1/auth/register`;
  const response = await callAPI<LoginResponse>(apiUrl, "POST", { email: email, password: password, name: name });
  return response;
}
