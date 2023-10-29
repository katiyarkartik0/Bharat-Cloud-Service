const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
dotenv.config();

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_PROGRAMATIC_USER_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_PROGRAMATIC_USER_SECRET_ACCESS_KEY,
  },
});

const putObjectUrl = ({ fileName, documentId, contentType }) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${process.env.AWS_S3_BUCKET_KEY}/${documentId}/${fileName}`,
    ContentType: contentType,
  });
  const url = getSignedUrl(s3client, command);
  return url;
};

const getObjectUrl = async ({ fileName, documentId }) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${process.env.AWS_S3_BUCKET_KEY}/${documentId}/${fileName}`,
  });
  const url = getSignedUrl(s3client, command);
  return url;
};

const getObjectStream = async ({ documentId, fileName }) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${process.env.AWS_S3_BUCKET_KEY}/${documentId}/${fileName}`,
  });
  const response = await s3client.send(command);

  // Read the object content as a stream
  const objectStream = response.Body;

  // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
  const str = await objectStream.transformToString();
  return str;
};

const deleteObject = async ({ fileName, documentId }) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${process.env.AWS_S3_BUCKET_KEY}/${documentId}/${fileName}`,
  });
  return await s3client.send(command);
};

module.exports = { putObjectUrl, getObjectUrl, getObjectStream, deleteObject };
