import { Notification } from '@prisma/client';
import Link from 'next/link';
import { BsTwitter } from 'react-icons/bs';

interface NotificationsFeedProps {
    notifications: Notification[]
}

const NotificationsFeed: React.FC<NotificationsFeedProps> = ({notifications}) => {

    if (!notifications.length) {
        return (
            <div className='text-white text-center px-4'>
                <p className='text-5xl mt-10 font-bold'>
                    Nothing to see here —<br /> yet
                </p>
                <span className='mt-3 block text-neutral-500 text-lg'>
                    From likes to reposts and a whole lot more, this<br />
                    is where all the action happens.
                </span>
            </div>
        );
    }

    return (
        <div className='flex flex-col'>

            {
                notifications.map((noti) => (
                    <Link
                        href={`/users/${noti.userId}`}
                        key={noti.id}
                        className='flex items-center p-6 gap-4 border-b border-neutral-800'
                    >
                        <BsTwitter scale={32} color='white' />
                        <p className='text-white'>
                            {noti.body}
                        </p>
                    </Link>
                ))
            }

        </div>
    )
}

export default NotificationsFeed