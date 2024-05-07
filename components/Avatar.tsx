"use client"

import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";


interface AvatarProps {
  user: Omit<User, 'hashedPassword'>;
  isLarge?: boolean;
  hasBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ user, isLarge, hasBorder }) => {
  // const { data: session } = useSession();

  if (!user) return null;

  return (
    <Link href={`/users/${user.id}`}>
      <div className={`
        relative object-contain rounded-full overflow-hidden hover:opacity-90 transition
        ${hasBorder ? 'border-2 border-black' : ''} 
        ${isLarge ? 'w-32 h-32' : 'w-12 h-12'}
        `}>
        <Image
          fill
          alt="Avatar"
          className="rounded-full object-contain"
          src={user.profileImage || '/images/placeholder.png'}
        />
      </div>
    </Link>

  )
}

export default Avatar