import getAttribute from "@utils/getAttribute";
import getAvatar from "@utils/getAvatar";
import clsx from "clsx";
import type { Profile } from "generated";
import Link from "next/link";
import type { FC } from "react";

interface Props {
  profile: Profile;
  showBio?: boolean;
  showFollow?: boolean;
  followStatusLoading?: boolean;
  isFollowing?: boolean;
  isBig?: boolean;
  linkToProfile?: boolean;
}

const UserProfile: FC<Props> = ({
  profile,
  showBio = false,
  isBig = false,
  linkToProfile = true,
}) => {
  const statusEmoji = getAttribute(profile?.attributes, "statusEmoji");
  const statusMessage = getAttribute(profile?.attributes, "statusMessage");
  const hasStatus = statusEmoji && statusMessage;

  const UserAvatar = () => (
    <img
      src={getAvatar(profile)}
      loading="lazy"
      className={clsx(
        isBig ? "w-14 h-14" : "w-10 h-10",
        "bg-gray-200 rounded-full border dark:border-gray-700/80"
      )}
      height={isBig ? 56 : 40}
      width={isBig ? 56 : 40}
      alt={profile?.handle}
    />
  );

  const UserName = () => (
    <>
      <div className="flex items-center max-w-sm truncate">
        <div className={clsx(isBig ? "font-bold" : "text-md")}>
          {profile?.name ?? profile?.handle}
        </div>
        {/* {isVerified(profile?.id) && (
          <BadgeCheckIcon className="w-4 h-4 text-brand ml-1" />
        )} */}
        {hasStatus ? (
          <div className="flex items-center text-gray-500">
            <span className="mx-1.5">·</span>
            <span className="text-xs flex items-center space-x-1 max-w-[10rem]">
              <span>{statusEmoji}</span>
              <span className="truncate">{statusMessage}</span>
            </span>
          </div>
        ) : null}
      </div>
      {/* <Slug className="text-sm" slug={profile?.handle} prefix="@" /> */}
    </>
  );

  const UserInfo: FC = () => {
    return (
      <div className="flex items-center space-x-3">
        <UserAvatar />
        <div>
          <UserName />
          {showBio && profile?.bio && (
            <div
              className={clsx(
                isBig ? "text-base" : "text-sm",
                "mt-2",
                "linkify leading-6"
              )}
            >
              {/* <Markup>{profile?.bio}</Markup> */}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-between items-center">
      {linkToProfile ? (
        <Link href={`/u/${profile?.handle}`}>
          <UserInfo />
        </Link>
      ) : (
        <UserInfo />
      )}
      {/* {showFollow &&
        (followStatusLoading ? (
          <div className="w-10 h-8 rounded-lg shimmer" />
        ) : following ? null : profile?.followModule?.__typename ===
          "FeeFollowModuleSettings" ? (
          <SuperFollow profile={profile} setFollowing={setFollowing} />
        ) : (
          <Follow profile={profile} setFollowing={setFollowing} />
        ))} */}
    </div>
  );
};

export default UserProfile;
