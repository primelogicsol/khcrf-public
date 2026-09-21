import { prisma } from '../config/db';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';

// Ensure cloudinary is configured
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class UploadService {
  /**
   * Upload a base64 or local file path to Cloudinary
   */
  static async uploadFile(fileStr: string, folder: string = 'hcrf_assets') {
    try {
      const uniqueId = randomUUID();
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder: folder,
        public_id: uniqueId,
        resource_type: 'auto',
      });
      
      return {
        providerId: uploadResponse.public_id,
        publicUrl: uploadResponse.secure_url,
        mimeType: uploadResponse.format,
        sizeBytes: uploadResponse.bytes,
        width: uploadResponse.width,
        height: uploadResponse.height
      };
    } catch (error) {
      console.error('Upload Error:', error);
      throw new Error('Failed to upload file to external provider.');
    }
  }

  /**
   * Remove a file from Cloudinary
   */
  static async deleteFile(providerId: string) {
    try {
      await cloudinary.uploader.destroy(providerId);
      return true;
    } catch (error) {
      console.error('Delete Error:', error);
      throw new Error('Failed to delete file from external provider.');
    }
  }
}
