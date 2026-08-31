import cloudinary from '../config/cloudinary.js';


const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};


const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;

  try {
    // remove asset from cloudinary storage
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};

export { uploadToCloudinary, deleteFromCloudinary };