import { getUserInfo } from "@/actions/profile";
import CommentItem from "@/components/CommentItem";
import Form from "@/components/Form";
import Header from "@/components/Header";
import PostItem from "@/components/PostItem";
import { getPost } from "@/hooks/usePosts";
import getSession from "@/libs/getSession";
import { BiLoader } from "react-icons/bi";



const PostPage = async ({ params }: {
    params: {
        username: string,
        postId: string;
    }
}) => {
    const session = await getSession();
    const post = await getPost(params.postId);

    const user = await getUserInfo(session?.user.id || null)

    return (
        <>
            <Header label="Post" showBackArrow />

            <div>
                {
                    post
                        ? <PostItem data={post} />
                        : <BiLoader size={30} className="mx-auto my-10 animate-spin text-white" />
                }
            </div>

            <Form
                isComment
                placeholder="Post your reply"
                user={user}
                postId={params.postId}
            />

            {post?.comments.map((comment) => (
                <CommentItem comment={comment} key={comment.id}/>
            ))}


        </>
    )
}

export default PostPage