import { create } from 'zustand'

interface LoginFormStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useLoginModal = create<LoginFormStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useLoginModal;