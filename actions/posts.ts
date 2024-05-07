"use server"

import { auth } from "@/auth";
import prismaDB from "@/libs/db";
import { commentButtonSchema, commentFormSchema, likeButtonSchema, postFormSchema } from "@/types/validations"
import { revalidatePath } from "next/cache";
import { z } from "zod"



export async function createPost(values: z.infer<typeof postFormSchema>) {
    try {

        const userAuth = await auth();

        if (!userAuth?.user) {
            throw new Error("User not authenticated");
        }

        const validations = postFormSchema.safeParse(values);

        if (!validations.success) {
            throw new Error("Validation failed");
        }

        const { body } = validations.data;

        const post = await prismaDB.post.create({
            data: {
                userId: userAuth.user.id,
                body
            },
        })

        revalidatePath('/')

        return post;

    } catch (error) {
        console.log('Error on create post', error)
        throw error;
    }
}


export async function addCommentAction(values: z.infer<typeof commentFormSchema>) {

    try {
        const userAuth = await auth();

        if (!userAuth?.user) {
            throw new Error("User not authenticated");
        }

        const validations = commentFormSchema.safeParse(values);

        if (!validations.success) {
            throw new Error("Validation failed");
        }

        const { body, postId } = validations.data;

        const addComment = await prismaDB.post.update({
            where: { id: postId },
            data: {
                comments: {
                    create: {
                        body,
                        user: { connect: { id: userAuth.user.id } }
                    }
                }
            },
        })

        // return {
        //     ...addComment,
        //     user: omitPassword(userAuth.user),
        // }

        revalidatePath(`/status/${postId}`);

        return addComment;
    } catch (error) {
        console.log('Error in addCommentAction', error);
        throw error;
    }

}

export async function likePostAction(values: z.infer<typeof likeButtonSchema>) {

    try {
        const userAuth = await auth();

        if (!userAuth?.user) {
            throw new Error("User not authenticated");
        }

        const validations = likeButtonSchema.safeParse(values);

        if (!validations.success) {
            throw new Error("Validation failed");
        }

        const { postId } = validations.data;

        const existPost = await prismaDB.post.findUnique({
            where: { id: postId },
        })

        if (!existPost) {
            throw new Error("Post does not exists");
        }

        const existLike = existPost.likedIds.some((id) => id === userAuth.user.id);

        if (existLike) {
            await prismaDB.post.update({
                where: { id: postId },
                data: { likedIds: existPost.likedIds.filter((id) => id !== userAuth.user.id) }
            });

            revalidatePath(`/status/${postId}`);

            return {
                message: "unLike successfully!"
            }

        } else {
            await prismaDB.post.update({
                where: { id: postId },
                data: {
                    likedIds: {
                        push: userAuth.user.id
                    }
                }
            });

            await prismaDB.notification.create({
                data: {
                    body: "Someone liked your tweet!",
                    userId: existPost.userId
                }
            })

            await prismaDB.user.update({
                where: { id: existPost.userId },
                data: {
                    hasNotification: true
                }
            })

            revalidatePath(`/status/${postId}`);
            revalidatePath('/')

            return {
                message: "Liked successfully!"
            }
        }

    } catch (error) {
        console.log('Error in addCommentAction', error);
        throw error;
    }

}

export async function deleteCommentAction(values: z.infer<typeof commentButtonSchema>) {

    try {
        const userAuth = await auth();

        if (!userAuth?.user) {
            throw new Error("User not authenticated");
        }

        const validations = commentButtonSchema.safeParse(values);

        if (!validations.success) {
            throw new Error("Validation failed");
        }

        const { commentId } = validations.data;

        const existComment = await prismaDB.comment.findUnique({
            where: { id: commentId }
        })

        if (!existComment) {
            throw new Error("Comment does not exists");
        }

        if (userAuth.user.id !== existComment.userId) {
            throw new Error("You are not the owner of this comment")
        }

        await prismaDB.comment.delete({
            where: { id: commentId }
        })

        revalidatePath(`/status`)

        return {
            message: "Comment delete successfully!"
        }

    } catch (error) {
        console.log('Error in addCommentAction', error);
        throw error;
    }

}


export async function getNotificationsAction() {
    try {
        const userAuth = await auth();

        if (!userAuth?.user) {
            throw new Error("User not authenticated");
        }

        const notifications = await prismaDB.notification.findMany({
            where: {
                userId: userAuth.user.id
            }
        })

        await prismaDB.user.update({
            where: { id: userAuth.user.id },
            data: {
                hasNotification: false
            }
        })


        return notifications;


    } catch (error) {
        console.log('Error on getNotifications', error);
        return [];
    }
}