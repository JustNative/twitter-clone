"use client"

import React, { useCallback, useMemo } from 'react'
import { Comment, Post, User } from '@prisma/client'
import Avatar from './Avatar';
import { formatDistanceToNowStrict } from 'date-fns';
import { AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import useLoginModal from '@/hooks/useLoginModal';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { likePostAction } from '@/actions/posts';
import { FaHeart } from 'react-icons/fa';

interface PostWithCUser {
  comments: Comment[] & {
    user?: Omit<User, "hashedPassword">;
  };
  user: Omit<User, "hashedPassword">;
}

interface PostItemProps {
  data: Post & PostWithCUser
}

const PostItem: React.FC<PostItemProps> = ({ data }) => {
  const { data: session } = useSession();
  const loginModal = useLoginModal();
  const router = useRouter();

  const createAt = useMemo(() => {
    if (!data.createdAt) return null;

    return formatDistanceToNowStrict(new Date(data.createdAt))
  }, [data.createdAt])


  const onLike = useCallback(async (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // TODO: implement like feature
    ev.stopPropagation();

    if (!session) {
      loginModal.onOpen()
      return;
    }

    try {
      const likePost = await likePostAction({ postId: data.id })

      toast.success(likePost.message)

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!")
    }

  }, [session, loginModal, data.id])

  const existLike = data.likedIds.some((id) => id === session?.user.id);

  return (
    <div className='border-b border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition'>
      <div
        onClick={() => router.push(`/${data.user.username}/status/${data.id}`)}
        className='flex items-center gap-3'>
        <Avatar user={data.user} />

        <div>
          <div className='flex items-center gap-2'>
            <Link href={`/users/${data.userId}`} className='flex items-center gap-2'>
              <p
                className='text-white font-semibold cursor-pointer hover:underline'>
                {data.user.name}
              </p>

              <span
                className='text-neutral-500 cursor-pointer hover:underline hidden md:block'
              >
                @{data.user.username}
              </span>
            </Link>

            <span className='text-neutral-500 text-sm'>
              {createAt?.toString()}
            </span>
          </div>

          <div className='text-white mt-1'>
            {data.body}
          </div>

          <div className='flex items-center mt-3 gap-10'>
            <div
              onClick={() => { }}
              className='flex items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500'>
              <AiOutlineMessage size={20} />
              <p>
                {data.comments.length || 0}
              </p>

            </div>

            <div
              onClick={onLike}
              className='flex items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500'>
              {existLike ? <FaHeart size={18} color='red' /> : <AiOutlineHeart size={20} />}

              <p>
                {data.likedIds.length || 0}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default PostItem