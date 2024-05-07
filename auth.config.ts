import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import prismaDB from "@/libs/db"
import bcrypt from "bcryptjs"
import { loginFormSchema } from "./types/validations"

export default {
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            authorize: async (credentials) => {

                try {
                    const validations = loginFormSchema.safeParse(credentials);

                    if (!validations.success) {
                        throw new Error('Invalid credentials')
                    }

                    const user = await prismaDB.user.findUnique({
                        where: {
                            email: credentials.email as string
                        }
                    })

                    if (!user || !user.hashedPassword) {
                        throw new Error("Invalid credentials")
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password as string,
                        user.hashedPassword
                    )

                    if (!isCorrectPassword) {
                        throw new Error("Invalid password")
                    }

                    const { hashedPassword, ...userWithoutPassword } = user;

                    return userWithoutPassword

                } catch (error: any) {
                    console.log(`Error on provider/auth/[...next].ts -> authorize: ${error}`)
                    throw error
                }
            },
        }),
    ]
} satisfies NextAuthConfig