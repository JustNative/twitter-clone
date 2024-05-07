"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/actions/profile";
import { User } from "@prisma/client";

export const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { data: session } = useSession();


    useEffect(() => {
        if (!session) return;

        const fetchCurrentUser = async (userId: string) => {
            try {
                if (!userId) return;
                setIsLoading(true);

                const response = await getUserInfo(userId);

                setCurrentUser(response);
            } catch (err) {
                console.log(err);
                setError('Failed to load movie data');
            } finally {
                setIsLoading(false);
            }
        }

        fetchCurrentUser(session?.user.id as string);

        console.log("---------useCurrentUser--------")
    }, [session?.user.id])

    return { currentUser, isLoading, error }

}