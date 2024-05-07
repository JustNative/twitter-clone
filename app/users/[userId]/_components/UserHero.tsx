import Avatar from "@/components/Avatar";
import { User } from "@prisma/client";
import Image from "next/image";


interface UserHeroProps {
    user: User
}

const UserHero: React.FC<UserHeroProps> = async ({ user }) => {

    return (
        <div>
            <div className="relative bg-neutral-700 h-44">
                {user.coverImage && (
                    <Image src={user.coverImage} fill alt="User Cover" className="object-cover" />
                )}

                <div className="absolute -bottom-16 left-4">
                    <Avatar user={user} isLarge hasBorder />
                </div>

            </div>

        </div>
    )
}

export default UserHero