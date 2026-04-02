import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { GetUserByCredsUsecase } from "./db/usecase/user/get_user_by_creds.usecase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const getUser = new GetUserByCredsUsecase();
        const user = await getUser.execute(
          credentials.email as string,
          credentials.password as string,
        );
        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
