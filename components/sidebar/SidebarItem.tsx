"use client"

import { useSession } from "next-auth/react";
import { useCallback } from "react";
import useLoginModal from "@/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { BsDot } from "react-icons/bs";

interface SidebarItem {
    href?: string;
    Icon: React.ReactElement;
    label: string;
    auth?: boolean;
    onClick?: () => void;
    alert?: boolean;
}

const SidebarItem: React.FC<SidebarItem> = ({
    href,
    Icon,
    label,
    auth,
    onClick,
    alert
}) => {
    const session = useSession();
    const loginModal = useLoginModal();
    const router = useRouter();

    const handleClick = useCallback(() => {

        if (onClick) {
            onClick();
            return;
        }

        if (auth && !session.data) {
            loginModal.onOpen();
            return;
        }

        if (href) {
            router.push(href)
        }

    }, [auth, href, loginModal, onClick, router, session])


    return (
        <div className="flex items-center" onClick={handleClick}>
            <div className="relative flex items-center justify-center lg:hidden rounded-full h-14 w-14 p-4 hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer">
                {/* <Icon size={28} color="white" /> */}
                {Icon}
                {
                    alert ? <BsDot className="text-sky-500 absolute -top-4 left-0" size={80} /> : null
                }
            </div>

            <div className="relative hidden lg:flex items-center gap-4 p-4 rounded-full hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer">
                {/* <Icon size={24} color="white" /> */}
                {Icon}
                <p className="hidden lg:block text-white text-xl">
                    {label}
                </p>

                {
                    alert ? <BsDot className="text-sky-500 absolute -top-4 left-0" size={70} /> : null
                }
            </div>

        </div>
    )
}

export default SidebarItem