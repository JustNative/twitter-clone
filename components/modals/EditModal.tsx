"use client"


import Modal from "../Modal"
import { useEffect, useState } from "react";
import Input from "../Input";
import useEditModal from "@/hooks/useEditModal";
import ImageUpload from "../ImageUpload";
import toast from "react-hot-toast";
import { updateProfileAction } from "@/actions/profile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSession } from "next-auth/react";

const EditModal = () => {
  const { currentUser } = useCurrentUser();
  const session = useSession();

  const editModal = useEditModal();

  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProfileImage(currentUser?.profileImage || '');
    setCoverImage(currentUser?.coverImage || '');
    setName(currentUser?.name || '');
    setUsername(currentUser?.username || '');
    setBio(currentUser?.bio || '');

  }, [currentUser?.profileImage, currentUser?.coverImage, currentUser?.name, currentUser?.username, currentUser?.bio])


  async function handleSubmit() {
    if (!profileImage || !coverImage || !name || !username || !bio) {
      toast.error('Please make sure all fields are filled out correctly!');

      console.log('filled: ', {
        profileImage, coverImage, name, username, bio
      })
      return;
    }

    try {
      setIsLoading(true);


      const updateProfile = await updateProfileAction({
        profileImage,
        coverImage,
        name,
        username,
        bio
      })

      console.log("updateProfile: ", updateProfile)

      editModal.onClose();

      session.update();

      toast.success("Profile updated successfully!")

    } catch (error) {
      console.log("Error on login: ", error);
      toast.error("An unexpected error occurred while updating the profile.");

    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ImageUpload
        value={profileImage}
        disabled={isLoading}
        onChange={(image) => setProfileImage(image)}
        label="Upload profile image"
      />

      <ImageUpload
        value={coverImage}
        disabled={isLoading}
        onChange={(image) => setCoverImage(image)}
        label="Upload cover image"
      />

      <Input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isLoading}
      />

      <Input
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        disabled={isLoading}
      />

      <Input
        placeholder="Username"
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={isLoading}
      />

    </div>
  )



  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionLabel="Save"
      onClose={editModal.onClose}
      onSubmit={handleSubmit}
      body={bodyContent}
    />
  )
}

export default EditModal