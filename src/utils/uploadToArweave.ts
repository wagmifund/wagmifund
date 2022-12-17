import axios from "axios";
import { ERROR_MESSAGE, SERVERLESS_URL } from "@utils/constants";
import toast from "react-hot-toast";

/**
 *
 * @param data - Data to upload to arweave
 * @returns arweave transaction id
 */
const uploadToArweave = async (data: any): Promise<string> => {
  try {
    const upload = await axios(`/api/metadata/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });

    const { id }: { id: string } = upload?.data;

    return id;
  } catch {
    toast.error(ERROR_MESSAGE);
    throw new Error(ERROR_MESSAGE);
  }
};

export default uploadToArweave;
