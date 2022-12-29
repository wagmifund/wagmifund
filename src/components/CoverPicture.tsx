import { FC, useState } from "react";
import clsx from "clsx";
import imageProxy from "@utils/imageProxy";
import getIPFSLink from "@utils/getIPFSLink";
import placeholderCover from "@assets/placeholder_cover.png";

interface Props {
  cover: string;
}
const CoverPicture: FC<Props> = ({ cover }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={clsx(
          " h-full object-cover w-full rounded-2xl max-h-[300px]",
          loading ? "opacity-0 h-0" : "opacity-1"
        )}
        alt="cover picture"
        src={
          cover
            ? imageProxy(getIPFSLink(cover), "cover")
            : `${placeholderCover}`
        }
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <div className="animate-pulse bg-slate-500 h-[300px] rounded-2xl" />
      )}
    </div>
  );
};
export default CoverPicture;
