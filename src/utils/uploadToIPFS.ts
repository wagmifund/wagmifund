import { S3 } from "@aws-sdk/client-s3";
import axios from "axios";
import { EVER_API, SERVERLESS_URL } from "@utils/constants";
import { v4 as uuid } from "uuid";

interface Attachment {
  item: string;
  type: string;
  altTag: string;
}

const params = {
  Bucket: "wagmi-fund",
  Key: uuid(),
};

const getS3Client = async () => {
  const token = await axios.get(`/api/sts/token`);
  const client = new S3({
    endpoint: EVER_API,
    credentials: {
      accessKeyId: token.data?.accessKeyId,
      secretAccessKey: token.data?.secretAccessKey,
      sessionToken: token.data?.sessionToken,
    },
    region: "us-west-2",
    maxAttempts: 3,
  });

  return client;
};

/**
 *
 * @param data - Data to upload to IPFS
 * @returns attachment array
 */
const uploadToIPFS = async (data: any): Promise<Attachment[]> => {
  try {
    const client = await getS3Client();
    const files = Array.from(data);
    const attachments = await Promise.all(
      files.map(async (_: any, i: number) => {
        const file = data.item(i);
        await client.putObject({
          ...params,
          Body: file,
          ContentType: file.type,
        });
        const result = await client.headObject(params);
        const metadata = result.Metadata;

        return {
          item: `ipfs://${metadata?.["ipfs-hash"]}`,
          type: file.type || "image/jpeg",
          altTag: "",
        };
      })
    );

    return attachments;
  } catch {
    return [];
  }
};

/**
 *
 * @param file - File object
 * @returns attachment or null
 */
export const uploadFileToIPFS = async (
  file: File
): Promise<Attachment | null> => {
  try {
    const client = await getS3Client();
    await client.putObject({ ...params, Body: file, ContentType: file.type });
    const result = await client.headObject(params);
    const metadata = result.Metadata;

    return {
      item: `ipfs://${metadata?.["ipfs-hash"]}`,
      type: file.type || "image/jpeg",
      altTag: "",
    };
  } catch {
    return null;
  }
};

export default uploadToIPFS;
