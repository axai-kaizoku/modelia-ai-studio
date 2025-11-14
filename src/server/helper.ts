"use server";

import axios, { AxiosError, type AxiosResponse } from "axios";
import { cache } from "react";
import { auth } from "./auth";

export const getTokenFromSession = cache(async () => {
  const session = await auth();
  const token = session?.token?.access?.token;
  return { token: token };
});

export type APIResult<T> = { error: boolean; data?: T; status?: number | string; message?: string };

export async function callAPIWithToken<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  body: unknown = null,
  headers: Record<string, string> = {} // Allow passing custom headers,
): Promise<APIResult<T>> {
  // Retrieve the token
  const { token } = await getTokenFromSession();

  if (!token) {
    return {
      error: true,
      status: 500,
      message: "Unauthorized: No token available.",
    };
  }

  try {
    // Default headers, including Authorization
    const defaultHeaders: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      ...headers,
    };

    // Set 'Content-Type' only if not already provided (for multipart/form-data)
    defaultHeaders["Content-Type"] ??= "application/json";

    // Make the API call using axios
    const response: AxiosResponse<T> = await axios({
      url,
      method,
      data: method === "POST" || method === "PUT" || method === "PATCH" ? body : undefined,
      headers: defaultHeaders,
    });

    // Return response data and status
    return {
      data: response?.data,
      error: false,
    };
  } catch (error) {
    // console.log(error)
    if (error instanceof AxiosError) {
      const backendMessage = error.response?.data?.message ?? error.message ?? "❌ API Request Failed";

      return {
        error: true,
        status: error.response?.status ?? 500,
        message: backendMessage,
      };
    }

    return {
      error: true,
      status: 500,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const callAPI = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  body?: unknown,
  headers?: Record<string, string>
): Promise<APIResult<T>> => {
  try {
    const response: AxiosResponse<T> = await axios({
      url,
      method,
      data: method !== "GET" ? body : undefined,
      headers,
    });

    return {
      error: false,
      data: response.data,
      status: response.status,
      // headers: response.headers,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      const backendMessage = error.response?.data?.message ?? error.message ?? "❌ API Request Failed";

      return {
        error: true,
        status: error.response?.status ?? 500,
        message: backendMessage,
      };
    }

    return {
      error: true,
      status: 500,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
