"use server"

import { registerFormSchema } from "@/types/validations";
import { z } from "zod"
import bcrypt from 'bcryptjs';
import prismaDB from "@/libs/db";

export async function createUserAction(values: z.infer<typeof registerFormSchema>) {

    try {
        const validations = registerFormSchema.safeParse(values);

        if (!validations.success) {
            throw new Error("Validation failed");
        }

        const { username, name, email, password } = validations.data;

        const hashedPass = await bcrypt.hash(password, 12);

        const user = await prismaDB.user.create({
            data: {
                username,
                name,
                email,
                hashedPassword: hashedPass
            },
        });

        const { hashedPassword, ...userWithoutPass } = user;

        return userWithoutPass;

    } catch (error) {
        console.log('Error in createUserAction', error);
        return null;
    }

}