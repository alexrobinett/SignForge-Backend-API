const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.AWS_BUCKET_REGION,
});

async function deleteFromS3(key) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  const command = new DeleteObjectCommand(params);
  return s3.send(command);
}

module.exports = {
  s3,
  deleteFromS3,
};
