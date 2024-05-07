"use client"

import { useCallback, useState } from "react";
import Button from "./Button";
import toast from "react-hot-toast";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { addCommentAction, createPost } from "@/actions/posts";
import Avatar from "./Avatar";
import { User } from "@prisma/client";

interface FormProps {
    placeholder: string;
    postId?: string;
    isComment?: boolean;
    user: User | null
}

const Form: React.FC<FormProps> = ({
    placeholder,
    postId,
    isComment,
    user
}) => {
    const [body, setBody] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();

    const onSubmit = useCallback(async () => {

        if (!body) return;

        try {

            setIsLoading(true);

            if(!isComment) {
                await createPost({ body });

                toast.success('X tweet created');
            } else {

                if(!postId) {
                    throw new Error("No Post ID provided");
                }

                await addCommentAction({ postId, body });

                // show toast
                toast.success(`@${user?.username} commented`);
            }


            

            
            setBody('')

        } catch (err) {
            console.log(err);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false)
        }
    }, [body, postId, isComment, user?.username]);


    return (
        <div className="border-b border-neutral-800 px-5 py-2">
            {user ? (
                <div className="flex gap-4">
                    <div>
                        <Avatar user={user} />
                    </div>

                    <div className="w-full">
                        <textarea
                            disabled={isLoading}
                            onChange={(e) => setBody(e.target.value)}
                            value={body}
                            placeholder={placeholder}
                            className="peer disabled:opacity-80 resize-none mt-3 w-full bg-black ring-0 outline-none text-xl placeholder-neutral-500 text-white"
                        />

                        <hr
                            className="opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition"
                        />

                        <div className="mt-4 flex justify-end">
                            <Button
                                disabled={isLoading || !body}
                                onClick={onSubmit}
                                label="X Tweet"
                            />
                        </div>
                    </div>

                </div>
            ) : (
                <div className="py-8">
                    <h1 className="text-white text-2xl text-center mb-4 font-bold">
                        Welcome to X
                    </h1>

                    <div className="flex items-center justify-center gap-4">
                        <Button label="Login" onClick={loginModal.onOpen} />
                        <Button label="Register" onClick={registerModal.onOpen} secondary />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Form