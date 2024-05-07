import { z } from "zod"


export const registerFormSchema = z.object({
    username: z.string().min(2).max(50),
    name: z.string().min(2).max(50),
    email: z.string().email().min(2).max(50),
    password: z.string().min(2).max(50),
})

export const loginFormSchema = z.object({
    email: z.string().email().min(2),
    password: z.string().min(2).max(10),
})


export const postFormSchema = z.object({
    body: z.string().min(2).max(250)
})

export const profileFormSchema = z.object({
    profileImage: z.string(),
    coverImage: z.string(),
    name: z.string().min(2).max(50),
    username: z.string().min(2).max(50),
    bio: z.string().min(2).max(250),
})

export const commentFormSchema = z.object({
    postId: z.string(),
    body: z.string().min(2).max(250)
})

export const likeButtonSchema = z.object({
    postId: z.string()
})

export const commentButtonSchema = z.object({
    commentId: z.string()
})
