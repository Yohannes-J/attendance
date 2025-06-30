import multer from "multer";

const storage = multer.memoryStorage(); // use memory instead of disk

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit 5MB
});

export default upload;
