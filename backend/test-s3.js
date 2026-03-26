require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });

const { S3Client, HeadBucketCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

async function test() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME }));
    console.log('✅ S3 credentials and bucket are valid!');
  } catch (error) {
    console.log('❌ S3 error:', error.message);
    console.log('Check your AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and AWS_S3_BUCKET_NAME');
  }
}

test();