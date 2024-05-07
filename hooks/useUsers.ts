import prismaDB from "@/libs/db";

export async function useUsers() {
    try {
        const users = await prismaDB.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true,
                profileImage: true,
                coverImage: true,
                image: true,
                bio: true
            }
        })

        return users;

    } catch (error) {
        console.log(error);
        // throw error;
        return [];
    }
}


export async function getUser(userId: string) {

    try {
        if (!userId) return null;

        const user = await prismaDB.user.findUnique({
            where: { id: userId },
            include: {
                posts: { orderBy: { createdAt: "asc" } },
                comments: true
            }
        })

        const followersCount = await prismaDB.user.count({
            where: {
                followingIds: {
                    has: userId
                }
            }
        })

        if (!user) return null;

        user.hashedPassword = "";

        return { ...user, followersCount };
    } catch (error) {
        console.log("Error getting user", error);
        return null;
    }

}