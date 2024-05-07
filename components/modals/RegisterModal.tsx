"use client"

import useLoginModal from "@/hooks/useLoginModal"
import Modal from "../Modal"
import { useCallback, useState } from "react";
import Input from "../Input";
import useRegisterModal from "@/hooks/useRegisterModal";
import { createUserAction } from "@/actions/register";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";


const RegisterModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = useCallback(() => {
    if (isLoading) return;

    registerModal.onClose();
    loginModal.onOpen();

  }, [isLoading, registerModal, loginModal])

  async function handleSubmit() {
    if (!email || !password || !username || !name) return;

    try {
      setIsLoading(true);

      const user = await createUserAction({
        username,
        name,
        email,
        password
      });

      if (!user) {
        throw new Error("Registration failed");
      }

      toast.success("Account created.")

      await signIn('credentials', {
        email,
        password,
      });

      registerModal.onClose();
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
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isLoading}
      />

      <Input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={isLoading}
      />

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
        Already Registered? {" "}
        <span
          onClick={onToggle}
          className="text-white cursor-pointer hover:underline"
        >
          Sign in
        </span>
      </p>

    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Create X Account"
      actionLabel="Sign Up/ Register"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit}
      body={bodyContent}
      footer={footerContent}

    />
  )
}

export default RegisterModal