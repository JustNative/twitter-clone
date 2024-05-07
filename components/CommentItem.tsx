
"use client"

import Avatar from './Avatar'
import { Comment, User } from '@prisma/client';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { MdOutlineDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
import { deleteCommentAction } from '@/actions/posts';
import { useSession } from 'next-auth/react';



interface CommentItemProps {
    comment: Comment & {
        user: Omit<User, "hashedPassword">;
    };
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    const { data: session } = useSession();

    const createAt = useMemo(() => {
        if (!comment.createdAt) return null;

        return formatDistanceToNowStrict(new Date(comment.createdAt))
    }, [comment.createdAt])

    const onDelete = useCallback(async () => {
        try {

            const deleteCommnet = await deleteCommentAction({ commentId: comment.id });

            toast.success(deleteCommnet.message)

        } catch (error: any) {
            console.log('Error:', error);
            toast.error(error.message || "An error occurred while deleting the comment")
        }

    }, [comment.id])

    return (
        <div className='border-b border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition'>
            <div className='flex items-center gap-3'>
                <Avatar user={comment.user} />

                <div>
                    <div className='flex items-center gap-2'>
                        <Link href={`/users/${comment.user.id}`} className='flex items-center gap-2'>
                            <p
                                className='text-white font-semibold cursor-pointer hover:underline'>
                                {comment.user.name}
                            </p>

                            <span
                                className='text-neutral-500 cursor-pointer hover:underline hidden md:block'
                            >
                                @{comment.user.username}
                            </span>
                        </Link>

                        <span className='text-neutral-500 text-sm'>
                            {createAt?.toString()}
                        </span>

                        {
                            session?.user.id === comment.userId && (
                                <MdOutlineDelete
                                    onClick={onDelete}
                                    size={28} className='text-white ml-auto hover:opacity-90' />
                            )
                        }
                    </div>

                    <div className='text-white mt-1'>
                        {comment.body}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CommentItem