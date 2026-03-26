import multer from "multer";
import multerS3 from "multer-s3";
import { s3, S3_BUCKET } from "../config/s3";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed"));
  }
};

// Profile images upload
export const uploadProfileImage = multer({
  storage: multerS3({
    s3,                           // S3Client from AWS SDK v3 ✅
    bucket: () => S3_BUCKET(),    // lazy read at request time
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `profile/${uuidv4()}.${ext}`);
    },
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Project / gallery images upload
export const uploadProjectImage = multer({
  storage: multerS3({
    s3,                           // S3Client from AWS SDK v3 ✅
    bucket: () => S3_BUCKET(),    // lazy read at request time
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `projects/${uuidv4()}.${ext}`);
    },
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
