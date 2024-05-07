import NextAuth, { type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { type Adapter } from "next-auth/adapters"
import prismaDB from "@/libs/db"
import authConfig from "@/auth.config"
import { User } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: Omit<User, 'hashedPassword'> & DefaultSession["user"]
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prismaDB) as Adapter,
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async session({ session, token }) {

            if (session && session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.bio = token.bio as string;
                // session.user.coverImage = token.coverImage as string;
                // session.user.profileImage = token.profileImage as string;
            }

            return session
        },
        async jwt({ token }) {

            try {
                const existUser = await prismaDB.user.findUnique({
                    where: { email: token.email as string }
                })

                if (!existUser) return token;

                token.id = existUser.id;
                token.username = existUser.username;
                token.bio = existUser.bio;
                // token.coverImage = existUser.coverImage;
                // token.profileImage = existUser.profileImage;

                return token
            } catch (error) {
                console.log("try error: ", error);
                return token
            }
        }
    },
    ...authConfig,
})