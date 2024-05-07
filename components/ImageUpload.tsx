import Image from 'next/image';
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploadProps {
    value: string;
    disabled: boolean;
    onChange(value: string): void;
    label: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    disabled,
    onChange,
    label
}) => {
    const [base64, setBase64] = useState(value);

    const handleChange = useCallback((base64: string) => {
        onChange(base64);
    }, [onChange]);

    const handleDrop = useCallback((files: any) => {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = (event: any) => {
            setBase64(event.target.result);
            handleChange(event.target.result);
        }

        reader.readAsDataURL(file);
    }, [handleChange])


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        onDrop: handleDrop,
        disabled,
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"]
        }
    })



    return (
        <div {...getRootProps({
            className: `w-full p-4 text-white text-center border-2 border-dotted rounded-md border-neutral-700 cursor-pointer ${isDragActive && "border-sky-600"}`
        })}>
            <input {...getInputProps()} />
            {
                base64 ? (
                    <div className='flex justify-center items-center'>
                        <Image src={base64} height={100} width={100} alt='Uploaded Image' />
                    </div>
                ) : (
                    <p className='text-white'>
                        {label}
                    </p>
                )
            }
        </div>
    )
}

export default ImageUpload