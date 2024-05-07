"use client"

import { FollowUserAction } from "@/actions/profile";
import Button from "@/components/Button";
import useEditModal from "@/hooks/useEditModal";
import useLoginModal from "@/hooks/useLoginModal";
import { User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { BiCalendar } from "react-icons/bi";

interface UserWithCount extends User {
    followersCount: number;
}

interface UserBioProps {
    user: UserWithCount;
    owner: boolean;
}

const UserBio: React.FC<UserBioProps> = ({ user, owner }) => {
    const { data: session } = useSession();
    const editModal = useEditModal();
    const loginModal = useLoginModal();


    const createAt = useMemo(() => {
        if (!user.createdAt) {
            return null;
        }

        return format(new Date(user.createdAt), 'MMMM yyyy');

    }, [user.createdAt]);


    const followHandler = useCallback(async () => {
        try {
            if (!session) {
                loginModal.onOpen();
                return;
            }

            const followUser = await FollowUserAction(user.id);

            // success toast
            toast.success(followUser.message || "Followed successfully");

        } catch (error: any) {
            console.log('Follow error', error);
            // error toast
            toast.error(error.message || "Failed to follow the user");
        }
    }, [loginModal, session, user.id])

    const isFollowing = user?.followingIds?.some((follow) => follow === session?.user.id)

    return (
        <div className="border-b border-neutral-800 pb-4">
            <div className="flex justify-end p-2">
                {owner ? (
                    <Button secondary label="Edit profile" onClick={editModal.onOpen} />
                ) : (
                    <Button
                        secondary
                        label={isFollowing ? "Subscribe" : "Follow"}
                        onClick={followHandler}
                        className={isFollowing ? "bg-subscribe text-white" : ""} />
                )}
            </div>

            <div className="mt-8 px-4">
                <div className="flex flex-col">
                    <p className="text-white text-2xl font-semibold">
                        {user.name}
                    </p>
                    <p className="text-base text-neutral-500">
                        @{user.username}
                    </p>
                </div>

                <div className="flex flex-col mt-4">
                    <p className="text-white">
                        {user.bio}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-neutral-500">
                        <BiCalendar size={24} />

                        <p>
                            Joined {createAt}
                        </p>
                    </div>

                </div>

            </div>

            <div className="flex items-center mt-4 gap-6 px-4">
                <div className="flex items-center gap-1">
                    <p className="text-white">
                        {user.followingIds.length}
                    </p>
                    <p className="text-neutral-500">
                        Following
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    <p className="text-white">
                        {user.followersCount}
                    </p>

                    <p className="text-neutral-500">
                        Followers
                    </p>
                </div>
            </div>

        </div>
    )
}

export default UserBio