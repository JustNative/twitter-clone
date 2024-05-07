import { BsBellFill, BsHouseFill } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import SidebarLogo from './SidebarLogo'
import SidebarItem from './SidebarItem'
import SidebarTweetButton from './SidebarTweetButton'

import { BiLogOut } from 'react-icons/bi'
import { getUser } from '@/hooks/useUsers'
import { User } from '@prisma/client'
import getSession from '@/libs/getSession'
import { signOutAction } from '@/actions/login'


const Sidebar = async () => {
  const session = await getSession();
  const authUser = await getUser(session?.user.id as string) as Omit<User, 'followersCount'>;

  const items = [
    {
      icon: <BsHouseFill size={28} color="white" />,
      label: 'Home',
      href: '/',
    },
    {
      icon: <BsBellFill size={28} color="white" />,
      label: 'Notifications',
      href: '/notifications',
      auth: true,
      alert: authUser?.hasNotification || false
    },
    {
      icon: <FaUser size={28} color="white" />,
      label: 'Profile',
      href: `/users/${authUser?.id}`,
      auth: true,
    },
  ]


  return (
    <div className='col-span-1 h-screen pr-4 md:pr-6 sticky top-0'>
      <div className='flex flex-col items-end'>
        <div className='space-y-2 lg:w-[230px]'>
          <SidebarLogo />

          {items.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              Icon={item.icon}
              label={item.label}
              auth={item.auth}
              alert={item.alert}
            />
          ))}

          {authUser && (
            <SidebarItem
              onClick={signOutAction}
              Icon={<BiLogOut size={28} color="white" />}
              label="Logout"
            />
          )}

          <SidebarTweetButton />

        </div>

      </div>

    </div>
  )
}

export default Sidebar