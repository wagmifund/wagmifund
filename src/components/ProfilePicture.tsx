import { FC, useState } from "react";
import clsx from "clsx";
import getAvatar from "@utils/getAvatar";
import { Profile } from "generated";

interface Props {
  profile?: Profile;
}
const ProfilePicture: FC<Props> = ({ profile }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div
      className={clsx(
        " h-[142px] w-[142px] rounded-full flex justify-center items-center",
        loading ? "animate-pulse bg-slate-600" : "bg-white"
      )}
    >
      <div className="max-h-[132px] max-w-[132px] rounded-full overflow-hidden">
        <img
          src={getAvatar(profile as Profile)}
          loading="lazy"
          className={clsx({ "h-0 opacity-0": loading })}
          onLoad={() => setLoading(false)}
          alt={profile?.handle}
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
