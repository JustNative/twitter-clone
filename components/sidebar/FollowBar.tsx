import { useUsers } from "@/hooks/useUsers"
import { User } from "@prisma/client";
import Avatar from "../Avatar";


const FollowBar = async () => {
  const users = await useUsers() as User[];

  return (
    <div className='col-span-1 px-6 py-4 hidden lg:block h-screen sticky top-0'>
      <div className='bg-neutral-800 rounded-xl p-4'>
        <h2 className='text-white text-lg font-semibold'>
          Suggested X follow
        </h2>

        <div className='flex flex-col gap-6 mt-4'>
          {users.map((user) => (
            <div key={user.id} className="flex gap-4">
              <Avatar user={user} />

              <div className="flex flex-col">
                <p className="text-white font-semibold text-sm">{user.name}</p>
                <p className="text-neutral-400 text-sm">@{user.username}</p>
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default FollowBar