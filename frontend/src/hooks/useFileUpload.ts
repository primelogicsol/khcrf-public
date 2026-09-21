
import { useState } from 'react';
import { uploadFile as uploadFileService } from '@/lib/cloudinary';

interface UseFileUploadReturn {
    uploadFile: (file: File) => Promise<string>;
    isUploading: boolean;
    error: string | null;
}

export const useFileUpload = (): UseFileUploadReturn => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (file: File): Promise<string> => {
        setIsUploading(true);
        setError(null);

        try {
            const url = await uploadFileService(file);
            return url;
        } catch (err: any) {
            console.error("Upload failed", err);
            setError(err.message || "Failed to upload file. Please try again.");
            throw err;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFile, isUploading, error };
};
