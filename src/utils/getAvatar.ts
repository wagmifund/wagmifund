import { ZERO_ADDRESS } from "@utils/constants";

import getIPFSLink from "./getIPFSLink";
import getStampFyiURL from "./getStampFyiURL";
import imageProxy from "./imageProxy";

/**
 *
 * @param profile - Profile object
 * @returns avatar image url
 */
const getAvatar = (profile: any): string => {
  return imageProxy(
    getIPFSLink(
      profile?.picture?.original?.url ??
        profile?.picture?.uri ??
        getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
    ),
    "avatar"
  );
};

export default getAvatar;
