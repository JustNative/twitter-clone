"use server"
import { auth } from "@/auth";
import prismaDB from "@/libs/db";
import { profileFormSchema } from "@/types/validations"
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod"

export async function updateProfileAction(values: z.infer<typeof profileFormSchema>) {
    try {

        const authUser = await auth();

        if (!authUser?.user) {
            throw new Error("Unauthenticated");
        }

        const validations = profileFormSchema.safeParse(values);

        if (!validations.success) {
            throw new Error("Validation failed");
        }

        const { username, name, profileImage, coverImage, bio } = validations.data;

        const updateUser = await prismaDB.user.update({
            where: { id: authUser!.user.id },
            data: {
                username,
                name,
                profileImage,
                coverImage,
                bio
            }
        });

        updateUser.hashedPassword = '';

        revalidatePath(`/users/${updateUser.id}`)

        return updateUser;

    } catch (error) {
        console.log('Error in updateProfile', error);
        throw error;
    }

}

export async function getUserInfo(userId: string | null) {
    try {
        if (!userId) {
            throw new Error("No userId provided");
        }

        const cuUser = await prismaDB.user.findUnique({
            where: { id: userId }
        })

        if (!cuUser) return null;

        cuUser.hashedPassword = '';

        return cuUser;

    } catch (error) {
        console.log("getUserInfo: ", error);

        return null;
    }
}

export async function FollowUserAction(userId: string) {
    try {
        const userAuth = await auth();

        if (!userAuth) {
            throw new Error("You must be logged to follow a user");
        }

        const existUser = await prismaDB.user.findUnique({
            where: { id: userId },
        })

        if (!existUser) {
            throw new Error(`The user with the id ${userId} doesn't exists`);
        }

        const isFollowing = existUser.followingIds.some((id) => id === userAuth.user.id);

        let updatedUser: User;

        if (!isFollowing) {
            updatedUser = await prismaDB.user.update({
                where: { id: existUser.id },
                data: { followingIds: { push: userAuth.user.id } }
            });

            revalidatePath(`/users/${userId}`)

            return {
                message: `You are now following @${existUser.username}`
            }

        } else {
            const updateFollowingIds = existUser.followingIds.filter((followingId) => followingId !== userAuth.user.id);

            updatedUser = await prismaDB.user.update({
                where: { id: existUser.id },
                data: { followingIds: updateFollowingIds }
            });

            revalidatePath(`/users/${userId}`)

            return {
                message: "Unfollowed successfully"
            }
        }

    } catch (error) {
        console.log('Error on FollowUserAction', error);
        throw error;
    }
}

