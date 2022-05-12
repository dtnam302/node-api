const cloudinary = require("../utils/cloudinary");

const uploadImage = async (files, desc, folder) => {
  const uploader = async (path) =>
    await cloudinary.uploader.upload(path, {
      folder: `Thesis/${folder}`,
      // use_filename: true,
      // public_id: originalname,
    });

  const urls = [];

  for (const index in files) {
    const { path } = files[index];
    let org_name = desc[index]; // phong_khach.jpg => phong_khach
    //org_name shoule be phong_khach, phong_ngu v.v.
    let newPath = await uploader(path, org_name);
    urls.push({
      imgUrl: newPath.url,
      name: org_name,
      publicId: newPath.public_id,
    });
  }
  return urls;
};

const deleteImage = async (public_id) => {
  return await cloudinary.uploader.destroy(public_id, (err, result) => {
    console.log(result);
  });
};

module.exports = { uploadImage, deleteImage };
