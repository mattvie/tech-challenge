import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = (
  file: Express.Multer.File,
  folder: string = 'uploads'
): Promise<ManagedUpload.SendData> => {
  const randomPart = Math.random().toString(36).substring(2, 8);
  const fileName = `${folder}/${Date.now()}-${randomPart}-${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return s3.upload(params).promise();
};

export const deleteFromS3 = (key: string): Promise<S3.DeleteObjectOutput> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: key,
  };

  return s3.deleteObject(params).promise();
};