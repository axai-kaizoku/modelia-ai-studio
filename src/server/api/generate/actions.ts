"use server";
import { env } from "@/env";
import { callAPIWithToken } from "@/server/helper";

export type Generation = {
  id: string;
  userId: string;
  prompt: string;
  style: string;
  imageUrl: string;
  originalImage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export const generateImage = async ({ image, prompt, style }: { image: string; prompt: string; style: string }) => {
  const res = await callAPIWithToken<Generation>(`${env.BASEURL_API}/v1/generate`, "POST", {
    imageUpload: image,
    prompt,
    style,
  });

  return res;
};

export const getAllGenerations = async () => {
  const res = await callAPIWithToken<Generation[]>(`${env.BASEURL_API}/v1/generate`, "GET");
  return res;
};
