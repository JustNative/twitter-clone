import { usePosts } from "@/hooks/usePosts"
import PostItem from "./PostItem";


interface PostFeedProps {
    userId?: string
}

const PostFeed: React.FC<PostFeedProps> = async ({ userId }) => {
    const posts = await usePosts(userId || null);

    return (
        <>
            {posts?.map((post) => (
                <PostItem key={post.id} data={post} />
            ))}
        </>
    )
}

export default PostFeed