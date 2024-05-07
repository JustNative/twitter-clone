"use client"

import { ChangeEvent } from "react";

interface InputProps {
    placeholder?: string;
    value?: string;
    type?: 'text' | 'password';
    disabled?: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
    placeholder,
    value,
    type = 'text',
    disabled = false,
    onChange
}) => {
    return (
        <div className="w-full">
            <input
                disabled={disabled}
                type={type}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                className="w-full p-4 text-lg bg-black border-2 border-neutral-800 rounded-md outline-none text-white focus:border-sky-500 focus:border-2 transition disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed"
            />
        </div>
    )
}

export default Input