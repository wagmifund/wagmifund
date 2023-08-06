import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

/*
 * Format Image url.
 *
 * The w3s gateway link is used to prepare the IPFS link from the Lens API.
 */

const formatImageUrl = (imageUrl: string, defaultPicture = null) => {
  if (!imageUrl) return defaultPicture;

  if (imageUrl.startsWith("ipfs://")) {
    return `https://w3s.link/ipfs/${imageUrl.replace("ipfs://", "")}`;
  }

  return imageUrl;
};

/*
 * Fetch user details from the lens graphql api
 */

const fetchUserDetails = async (username: string) => {
  const user = await fetch("https://api.lens.dev/", {
    method: "POST",
    headers: {
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
      Accept: "application/json",
      Connection: "keep-alive",
      DNT: "1",
      Origin: "https://api.lens.dev",
    },
    body: JSON.stringify({
      query: `{\n  profile(request: { handle: "${username}" }) {\n    handle\n    name\n    bio\n    picture {\n      ... on NftImage {\n        contractAddress\n        tokenId\n        uri\n        verified\n      }\n      ... on MediaSet {\n        original {\n          url\n          mimeType\n        }\n      }\n      __typename\n    }\n  }\n}\n`,
    }),
  });

  const userData = await user.json();

  return await userData;
};

/*
 * Generate Image based on the lens handle
 */

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const providedHandle = searchParams.get("handle");

  if (!providedHandle) {
    return new ImageResponse(<>Visit with &quot;?handle=lens_handle&quot;</>, {
      width: 1200,
      height: 630,
    });
  }

  const userDetails = await fetchUserDetails(providedHandle);

  const { handle, bio, name, picture } = userDetails.data.profile;

  const image = formatImageUrl(picture.original.url);

  return new ImageResponse(
    (
      <>
        <div tw="flex h-[600px] w-[1200px] bg-white flex-col">
          <div tw="h-[579px] w-[1200px] flex flex-row-reverse">
            <div tw="flex w-[925px] pl-[90px] flex-col">
              <div tw="pt-[28px] flex text-[102px] font-bold w-[400px] truncate">
                {name.split(" ").slice(0, 2).join(" ")}
              </div>
              <div tw="text-[#5C19D2] font-bold flex mt-[-5px] ml-[10px] text-[40px]">
                {handle}
              </div>

              <div
                tw="mt-[12px] text-[30px] flex h-[150px] truncate"
                style={{
                  maxWidth: "700px",
                  wordBreak: "break-word",
                  maxHeight: "150px",
                }}
              >
                {bio}
              </div>
            </div>

            <div tw="flex flex-col w-[275px] pl-[84px] h-[579px]">
              <div tw="flex items-center justify-center rounded-[10px] bg-[#C3B0EE] mt-[71px] h-[225px] w-[225px]">
                <img
                  tw="h-[250px] w-[250px] rounded-[10px]"
                  src={image ?? ""}
                />
              </div>
              <img
                tw="h-[100px] w-[100px] mt-[120px] ml-[900px] rounded-full"
                src="https://ik.imagekit.io/wagmifund/https://ik.imagekit.io/lens/media-snapshot/2c81381bece8caf183a814b90db8cbfc7029616ffe2173b381142a35ab32209c.jpg?tr:h-250,tr:w-250"
              />
            </div>
          </div>
          <div tw="h-[21px] bg-[#5C19D2] w-[1200px] flex" />
        </div>
      </>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
