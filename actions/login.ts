"use server"

import { signIn, signOut } from "@/auth";
import { loginFormSchema } from "@/types/validations";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod"


export const signInWithCredentials = async (values: z.infer<typeof loginFormSchema>) => {
    try {
        const { email, password } = values;

        await signIn("credentials", {
            email,
            password,
            redirectTo: '/'
        })

        revalidatePath('/')

        return undefined;

    } catch (error: any) {

        if (error instanceof Error) {
            const { type, cause } = error as AuthError;

            switch (type) {
                case "CredentialsSignin":
                    throw new Error('Wrong username or password');
                case "CallbackRouteError":
                    throw new Error(cause?.err?.message);
                default:
                    throw error || "Something went wrong.";
            }
        }

        throw error;
    }
}


export const signOutAction = async () => {
    try {

        await signOut();

        cookies().delete('authjs.session-token')

        revalidatePath('/')

        return undefined;

    } catch (error: any) {
        throw error;
    }
}