const cloudinary = require("../utils/cloudinary");

const uploadImage = async (files, folder) => {
  const uploader = async (path, originalname) =>
    await cloudinary.uploader.upload(path, {
      folder: `Thesis/${folder}`,
      //use_filename: true,
      //public_id: originalname,
    });

  const urls = [];

  for (const file of files) {
    const { path, originalname } = file;
    let org_name = originalname.split(".")[0]; // phong_khach.jpg => phong_khach
    //org_name shoule be phong_khach, phong_ngu v.v.
    let newPath = await uploader(path, org_name);
    urls.push({ imgUrl: newPath.url, name: org_name });
  }
  return urls;
};
module.exports = uploadImage;
