import Header from '@/components/Header'
import { getUser } from '@/hooks/useUsers'
import { VscLoading } from 'react-icons/vsc';
import UserHero from './_components/UserHero';
import UserBio from './_components/UserBio';
import PostFeed from '@/components/PostFeed';
import getSession from '@/libs/getSession';

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const userAuth = await getSession();
  const user = await getUser(params.userId);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <VscLoading size={32} color='white' className='animate-spin' />
      </div>
    )
  }

  return (
    <>
      <Header showBackArrow label={user?.name || 'Profile'} />

      <UserHero user={user} />

      <UserBio user={user} owner={userAuth?.user.id === params.userId} />

      <PostFeed userId={params.userId as string} />

    </>
  )
}

export default UserPage