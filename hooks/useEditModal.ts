import { create } from 'zustand'

interface EditFormStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useEditModal = create<EditFormStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useEditModal;