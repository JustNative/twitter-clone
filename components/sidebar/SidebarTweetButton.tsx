"use client"

import useLoginModal from '@/hooks/useLoginModal'
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { FaFeather } from 'react-icons/fa'

const SidebarTweetButton = () => {
    const loginModel = useLoginModal();
    const { data: session } = useSession();

    const onClick = useCallback(() => {

        if (!session) {
            loginModel.onOpen();
        } else {
            console.log("Tweeeeeeeeet")
        }

    }, [loginModel, session])

    return (
        <div onClick={onClick}>
            <div className='flex justify-center items-center lg:hidden mt-6 rounded-full h-14 w-14 p-4 bg-sky-400 hover:bg-opacity-80 transition cursor-pointer'>
                <FaFeather size={24} color='white' />
            </div>

            <div className='mt-6 hidden lg:block px-4 py-2 rounded-full bg-sky-500 hover:bg-opacity-90 cursor-pointer'>
                <p className='text-center text-white text-xl font-semibold'>
                    Post
                </p>
            </div>

        </div>
    )
}

export default SidebarTweetButton