import cloudinary from '../configs/cloudinary.js';
import fs from 'fs';

const USE_CLOUDINARY = process.env.USE_CLOUDINARY === 'true';

/**
 * Upload an image to Cloudinary (or return a placeholder if disabled)
 * @param {string} filePath - Local file path from multer
 * @param {string} folder - Cloudinary folder name
 * @returns {{ url: string, publicId: string }}
 */
export const uploadImage = async (filePath, folder = 'hangout') => {
  try {
    if (!USE_CLOUDINARY) {
      // Return the local file path as URL during development
      return { url: `/uploads/${filePath.split(/[\\/]/).pop()}`, publicId: '' };
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'limit', quality: 'auto', format: 'webp' },
      ],
    });

    // Clean up local file after upload
    fs.unlinkSync(filePath);

    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    // Clean up on failure too
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId
 */
export const deleteImage = async (publicId) => {
  if (!USE_CLOUDINARY || !publicId) return;
  await cloudinary.uploader.destroy(publicId);
};
