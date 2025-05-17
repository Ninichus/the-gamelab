import "server-only";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const bucketName = process.env.BUCKET_NAME;

const s3Client = new S3Client({
  forcePathStyle: true,
  region: process.env.BUCKET_REGION,
  endpoint: process.env.BUCKET_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY_ID!,
    secretAccessKey: process.env.BUCKET_ACCESS_KEY_SECRET!,
  },
});

export async function uploadFile(fileId: string, file: File) {
  return s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileId,
      Body: Buffer.from(await file.arrayBuffer()),
    })
  );
}

export async function getFile(fileId: string): Promise<Uint8Array | undefined> {
  const output = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: fileId,
    })
  );

  const file = await output.Body?.transformToByteArray();

  return file;
}

export async function deleteFile(fileId: string) {
  return s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileId,
    })
  );
}
