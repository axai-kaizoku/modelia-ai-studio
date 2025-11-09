import { env } from "@/env";
import { type DefaultSession, type NextAuthConfig, type Session, type User } from "next-auth";
import { type DefaultJWT, type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export type LoggedInUser = {
  _id: string;
  name: string;
  orgId: string;
  gender: string;
  password: string;
  email: string;
  phone: string;
  role: number;
  hasPurchased: boolean;
  isTcValidated: boolean;
  designation?: string | null;
  image: string;
  sessionId: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: LoggedInUser;
};

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      token?: string;
      user: LoggedInUser;
      message?: string;
      // ...otherResponse["user"][0]
      // ...other properties
    } & DefaultSession["user"];
  }

  export interface AdapterUser {
    // id?: string
    message?: string;
    token?: string;
    user: LoginResponse["user"];
  }

  interface User {
    // id?: string
    token?: string;
    message?: string;
    user: LoginResponse["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface JWT extends DefaultJWT {
    // id?: string
    token?: string;
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
        const res = await fetch(`${env.BASEURL_API}/eppbackend/v1/auth/verify-code`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            code: credentials?.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        let body: any;
        try {
          body = await res.json();
        } catch {
          const text = await res.text();
          console.error("[AUTH ERROR] Non-JSON response:", text.slice(0, 200));
          throw new Error("Invalid response from auth server (non-JSON)");
        }
        if (res.status === 200) return body as unknown as LoginResponse;
        return {
          message: body.message,
          token: "error",
          user: {
            _id: "string",
            name: "string",
            orgId: "string",
            gender: "string",
            password: "XXXXXX",
            email: "string",
            phone: "string",
            role: 0,
            hasPurchased: false,
            isTcValidated: false,
            designation: "string",
            image: "string",
            sessionId: "string",
          },
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  trustHost: true,
  secret: env.AUTH_SECRET,
  callbacks: {
    signIn: async ({ account, profile, user }) => {
      if (account?.provider === "credentials") {
        if (user.token === "error") return `/?error=${user?.message}`;
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
      if (token) {
        session.user.token = token.token;
        session.user.user = token.user as unknown as LoggedInUser;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
