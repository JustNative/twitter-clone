import { auth } from "@/auth";
import Header from "@/components/Header"
import { redirect } from "next/navigation";
import NotificationsFeed from "./_components/NotificationsFeed";
import { getNotificationsAction } from "@/actions/posts";

const NotificationsPage = async () => {
    const authUser = await auth();
    const notifications = await getNotificationsAction();

    if (!authUser) {
        redirect('/')
    }

    if (!authUser) {
        return <p className="text-white">Not Authorized</p>;
    }

    return (
        <>
            <Header label="Notifications" showBackArrow />

            <NotificationsFeed notifications={notifications}/>

        </>
    )
}

export default NotificationsPage