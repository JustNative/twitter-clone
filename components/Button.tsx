

interface ButtonProps {
    label: string;
    secondary?: boolean;
    fullWidth?: boolean;
    large?: boolean;
    onClick: () => void;
    disabled?: boolean;
    outline?: boolean;
    className?: string
}

const Button: React.FC<ButtonProps> = ({
    label,
    secondary,
    fullWidth,
    large,
    onClick,
    disabled,
    outline,
    className
}) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`
                disabled:opacity-70 disabled:cursor-not-allowed rounded-full font-semibold hover:opacity-80 transition border-2
                ${fullWidth ? "w-full" : "w-fit"}
                ${secondary ? "bg-white text-black border-black" : "bg-sky-500 text-white border-sky-500"}
                ${large ? "text-xl px-5 py-3" : "text-base px-4 py-2"} 
                ${outline ? "bg-transparent border-white text-white" : ""}
                ${className}
        `}
        >
            {label}
        </button>
    )
}

export default Button

// ${secondary ? "text-white border border-white/60" : "bg-sky-500 text-white border-sky-500"}