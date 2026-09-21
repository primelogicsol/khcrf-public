import api from "./api";

interface UploadSignature {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
}

// ... imports

// ... interface

export const uploadFile = async (file: File): Promise<string> => {
    try {
        // 1. Get signature from backend
        const signatureResponse = await api.get<UploadSignature>('/upload/signature');
        const responseData = (signatureResponse.data as any).data || signatureResponse.data;
        const { signature, timestamp, cloudName, apiKey } = responseData;

        // 2. Prepare form data for Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);

        // Determine resource type
        // Use 'raw' for PDFs to ensure they are treated as files and not images
        // This avoids issues with large PDFs or preview generation failures
        const resourceType = file.type === 'application/pdf' ? 'raw' : 'auto';

        // 3. Upload to Cloudinary
        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await uploadResponse.json();

        if (data.secure_url) {
            return data.secure_url;
        } else {
            console.error("Cloudinary upload error:", data);
            throw new Error(data.error?.message || "Failed to upload file");
        }
    } catch (error) {
        console.error("File upload failed:", error);
        throw error;
    }
};
