import {useState, useEffect, useRef} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, XCircle } from "lucide-react";

interface ImageUploaderProps {
    value?: string;
    onChange: (base64OrUrl: string | undefined) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange }) => {
    const [preview, setPreview] = useState<string | null>(value || null);
    const [imageUrl, setImageUrl] = useState<string>( "");

    useEffect(() => {
        if (value) {
            setPreview(value);
        }
    }, [value]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreview(base64String);
                setImageUrl("");
                onChange(base64String ?? undefined);
            };
            reader.readAsDataURL(file);
        }
    };
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;
        setImageUrl(url);
        setPreview(url);
        onChange(url || undefined);
    };

    const handleReset = () => {
        setPreview(null);
        setImageUrl("");
        onChange(undefined);
    };

    return (
        <div>
            {preview ? (
                <div className="relative w-full py-4">
                    <img src={preview} alt="Preview" className="max-h-40 w-full object-cover rounded-lg shadow-md"/>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={handleReset}
                    >
                        <XCircle size={20}/>
                    </Button>
                </div>
            ) : (
                <p className="text-gray-500 text-center">No Image selected</p>
            )}
            <div className="w-full py-4">
                <Input
                    type="text"
                    value={imageUrl}
                    placeholder="Or enter url..."
                    onChange={handleUrlChange}
                />
            </div>
            {/* Input pour URL */}


            <div className="w-full py-4">
                {/* Bouton custom qui ouvre le file input */}
                <Button variant="outline" className="w-full flex gap-2" type="button" onClick={handleButtonClick}>
                    <UploadCloud size={18}/> Select image
                </Button>

                {/* Input caché */}
                <Input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                       onChange={handleFileChange}/>
            </div>
        </div>


    );
};

export default ImageUploader;
