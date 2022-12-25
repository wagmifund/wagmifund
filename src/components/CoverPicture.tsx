import { useState } from "react";
import clsx from "clsx";
const CoverPicture = () => {
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
        src="https://rarible.mypinata.cloud/ipfs/QmahqDp3zAG4tcQyxyAnB9fVJav9rrwBiFJedWHb4txkmE"
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <div className="animate-pulse bg-slate-500 h-[300px] rounded-2xl" />
      )}
    </div>
  );
};
export default CoverPicture;
