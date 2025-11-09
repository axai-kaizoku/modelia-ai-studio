import { env } from "@/env";
import { type DefaultSession, type NextAuthConfig, type Session, type User } from "next-auth";
import { type DefaultJWT, type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export type LoggedInUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  user: LoggedInUser;
  message?: string;
  token: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
};

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: LoggedInUser & DefaultSession["user"];
    token: {
      access: {
        token: string;
        expires: string;
      };
      refresh: {
        token: string;
        expires: string;
      };
    };
  }

  export interface AdapterUser {
    message?: string;
    token: LoginResponse["token"];
    user: LoginResponse["user"];
  }

  interface User {
    token: LoginResponse["token"];
    message?: string;
    user: LoginResponse["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface JWT extends DefaultJWT {
    token: LoginResponse["token"];
    user: LoginResponse["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  // Helpful during setup; remove later if you want
  // debug: true,
  // logger: {
  //   error(code, ...msg) { console.error("[next-auth][error]", code, ...msg) },
  //   warn(code, ...msg)  { console.warn("[next-auth][warn]", code, ...msg) },
  //   debug(code, ...msg) { console.debug("[next-auth][debug]", code, ...msg) },
  // },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${env.BASEURL_API}/v1/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        let body: Response & { message?: string };
        try {
          body = await res.json();
        } catch {
          const text = await res.text();
          console.error("[AUTH ERROR] Non-JSON response:", text.slice(0, 200));
          throw new Error("Invalid response from auth server (non-JSON)");
        }
        if (res.status === 200) {
          const loginResponse = body as unknown as LoginResponse;
          return {
            token: loginResponse.token,
            user: loginResponse.user,
          };
        }
        return {
          message: body?.message || "Invalid credentials",
          user: {
            createdAt: "",
            email: "",
            id: "",
            isEmailVerified: false,
            name: "",
            password: "",
            role: "",
            updatedAt: "",
          },
          token: {
            access: {
              expires: "",
              token: "",
            },
            refresh: {
              expires: "",
              token: "",
            },
          },
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  trustHost: true,
  secret: env.AUTH_SECRET,
  callbacks: {
    signIn: async ({ account, user }) => {
      if (account?.provider === "credentials") {
        if (!user || user.message) return `/?error=${user?.message}`;
        return true;
      }
      return true;
    },
    jwt: async ({ token, user }: { token: JWT; user: User }) => {
      if (user) {
        token.token = user.token;
        token.user = user.user;
      }

      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (token?.token) {
        session.token = token.token;
        session.user = { ...session.user, ...token.user };
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
