"use client"

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";


interface HeaderProps {
    label: string;
    showBackArrow?: boolean
}

const Header: React.FC<HeaderProps> = ({ label, showBackArrow }) => {
    const router = useRouter();

    const handleBack = useCallback(() => {
        router.back();
    }, [router])

    return (
        <div className="border-b border-neutral-800 p-5 z-10 bg-black/90">
            <div className="flex flex-row items-center gap-2 ">
                {showBackArrow && (
                    <BiArrowBack
                        onClick={handleBack}
                        size={20}  // in pixels
                        className="cursor-pointer hover:opacity-70 transition text-white"
                    />
                )}

                <h1 className="text-white text-xl font-semibold">
                    {label}
                </h1>
            </div>

        </div>
    )
}

export default Header