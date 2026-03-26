import multer from "multer";
import multerS3 from "multer-s3";
import { s3, S3_BUCKET } from "../config/s3";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed"));
  }
};

export const uploadProfileImage = multer({
  storage: multerS3({
    s3,
    bucket: S3_BUCKET(),
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const ext = file.originalname.split(".").pop() || "jpg";
      cb(null, `profile/${uuidv4()}.${ext}`);
    },
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProjectImage = multer({
  storage: multerS3({
    s3,
    bucket: S3_BUCKET(),
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const ext = file.originalname.split(".").pop() || "jpg";
      cb(null, `projects/${uuidv4()}.${ext}`);
    },
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
