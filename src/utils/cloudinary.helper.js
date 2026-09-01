import { getCloudinaryInstance } from '../config/cloudinary.js';

const uploadToCloudinary = (fileBuffer, folder) => {

  return new Promise((resolve, reject) => {
    const cloudinary = getCloudinaryInstance();

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },

      (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }

        resolve({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }

    );

    uploadStream.on('error', reject);
    uploadStream.end(fileBuffer);

  });
};

const deleteFromCloudinary = async (publicId) => {

  if (!publicId) return null;
  const cloudinary = getCloudinaryInstance();

  return cloudinary.uploader.destroy(publicId);
};

export { uploadToCloudinary, deleteFromCloudinary };