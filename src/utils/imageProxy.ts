import { IMGPROXY_URL } from "@utils/constants";
import { log } from "console";

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */
const imageProxy = (url: string, name?: string): string => {
  return name
    ? `${IMGPROXY_URL}/${url}?tr:h-250,tr:w-250`
    : `${IMGPROXY_URL}/${url}?tr:di-placeholder.webp`;
};

export default imageProxy;
