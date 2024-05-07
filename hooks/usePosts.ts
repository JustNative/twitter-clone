import prismaDB from "@/libs/db";

export async function usePosts(userId: string | null) {
    try {
        // const userAuth = await auth();

        // if(!userAuth?.user) {
        //     throw new Error("User not authenticated");
        // }

        if (userId) {
            const userPosts = await prismaDB.post.findMany({
                where: { userId },
                include: {
                    user: true,
                    comments: true
                },
                orderBy: { createdAt: "desc" }
            })

            return userPosts;
        }

        const allPosts = await prismaDB.post.findMany({
            include: {
                user: true,
                comments: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return allPosts;

    } catch (error) {
        console.log('Error on get posts', error);
        return [];
    }

}

export async function getPost(postId: string | null) {
    try {

        if (!postId) {
            throw new Error("Invalid post id")
        }

        const post = await prismaDB.post.findUnique({
            where: { id: postId },
            include: {
                user: true,
                comments: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })

        return post;

    } catch (error) {
        console.log('Error on get posts', error);
        return null;
    }

}