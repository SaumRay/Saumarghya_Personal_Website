import { S3Client } from "@aws-sdk/client-s3";

// AWS SDK v3 — compatible with multer-s3 v3
export const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_REGION as string,
});

export const S3_BUCKET = () => {
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!bucket) throw new Error("AWS_S3_BUCKET_NAME is not set in environment variables");
  return bucket;
};

export const getS3Url = (key: string): string =>
  `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
