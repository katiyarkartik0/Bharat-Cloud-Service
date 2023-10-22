const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
dotenv.config();

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const s3client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_PROGRAMATIC_USER_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_PROGRAMATIC_USER_SECRET_ACCESS_KEY,
  },
});

const putObjectUrl = ({ fileName, contentType }) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${process.env.AWS_S3_BUCKET_KEY}/${fileName}`,
    ContentType: contentType,
  });
  const url = getSignedUrl(s3client, command);
  return url;
};

module.exports = { putObjectUrl };
