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

const allowedAudioMimeTypes = [
  "audio/mpeg", "audio/mp3", "audio/mp4", "audio/m4a",
  "audio/wav", "audio/ogg", "audio/aac", "audio/x-m4a"
];

const audioFileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedAudioMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files are allowed (mp3, m4a, wav, ogg, aac)"));
  }
};

export const uploadAudio = multer({
  storage: multerS3({
    s3,
    bucket: S3_BUCKET(),
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const ext = file.originalname.split(".").pop() || "mp3";
      cb(null, `music/audio/${uuidv4()}.${ext}`);
    },
  }),
  fileFilter: audioFileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});