"use client"

import useLoginModal from "@/hooks/useLoginModal"
import Modal from "../Modal"
import { useCallback, useState } from "react";
import Input from "../Input";
import useRegisterModal from "@/hooks/useRegisterModal";
import toast from "react-hot-toast";
import { signInWithCredentials } from "@/actions/login";
import { useSession } from "next-auth/react";


const LoginModal = () => {
  const session = useSession();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = useCallback(() => {
    if (isLoading) return;

    loginModal.onClose();
    registerModal.onOpen();

  }, [isLoading, registerModal, loginModal])

  async function handleSubmit() {
    if (!email || !password) return;

    try {
      setIsLoading(true);

      await signInWithCredentials({
        email,
        password,
      })

      loginModal.onClose();

      toast.success("Login Successful!")
      session.update();

      setPassword('')
      setEmail('')

    } catch (error: any) {
      console.log("Error on login: ", error);
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isLoading}
      />

      <Input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoading}
      />

    </div>
  )

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        New To X {" "}
        <span
          onClick={onToggle}
          className="text-white cursor-pointer hover:underline"
        >
          Create Account
        </span>
      </p>

    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Sign In"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit}
      body={bodyContent}
      footer={footerContent}

    />
  )
}

export default LoginModal