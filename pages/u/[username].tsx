import AboutSection from "@components/AboutSection";
import { Card } from "@components/Card";
import CoverPicture from "@components/CoverPicture";
import ProfilePicture from "@components/ProfilePicture";
import { StackedTierCard, TierCards } from "@components/TierCard";
import ColorPicker from "@components/ColorPicker";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import ProfileEditor from "@components/ProfileEditor";
import { useProfileQuery } from "generated";
import { useRouter } from "next/router";
import { useAppStore } from "@store/app";
import TierCardData from "@components/TierCardData";
import { useProfileUIStore } from "@store/profile";
const ProfilePage = ({ isEditable = true }) => {
  const { cardView, theme, corners } = useProfileUIStore(
    (state) => state.profileUIData
  );

  useEffect(() => {
    document
      .querySelector('[data-theme="user"]')
      ?.style.setProperty("--rounded-box", corners);
    document
      .querySelector('[data-theme="user"]')
      ?.style.setProperty("--p", theme);
  }, []);

  const currentProfile = useAppStore((state) => state.currentProfile);

  const {
    query: { username, type },
  } = useRouter();
  const { data, loading, error } = useProfileQuery({
    variables: {
      request: { handle: username },
      who: currentProfile?.id ?? null,
    },
    skip: !username,
  });
  const profile = data?.profile;

  if (error) {
    return <div />;
  }

  if (
    loading ||
    (!data &&
      profile?.attributes?.filter(({ key }) => key === "about")?.[0]?.value
        ?.length)
  ) {
    return <div>page loader</div>;
  }

  if (!profile) {
    return <div>404 page</div>;
  }

  return (
    <>
      <div
        className="w-full z-1 bg-[#0d1933] text-white flex flex-grow px-4 sm:px-8 flex-col"
        data-theme="user"
      >
        {isEditable && <ProfileEditor />}

        <span className="bg-gradient-sides left"></span>
        <span className="bg-gradient-sides right"></span>

        <div className="relative sm:min-h-[300px]">
          <CoverPicture />
          <div className="absolute -bottom-8 left-1/2 -translate-x-[71px] z-10">
            <ProfilePicture />
          </div>
        </div>
        <div className="text-center">
          <div className=" font-space-grotesek font-bold text-4xl mt-10">
            {profile.name}
          </div>
          <div className=" font-space-grotesek font-semibold text-lg mt-2">
            {profile.handle}
          </div>
          <div className="font-space-grotesek font-medium mt-3">
            {profile.bio}
          </div>
        </div>
        <div className="mt-10 w-full md:w-[80%] flex sm:justify-between mx-auto flex-wrap">
          {cardView === "card" && (
            <TierCardData isStacked={false} profile={profile} />
          )}
        </div>
        <div
          className={clsx(
            "flex lg:flex-nowrap flex-wrap-reverse w-full md:w-[80%] mt-5 mx-auto",
            cardView === "card"
          )}
        >
          <Card className={clsx("w-full", cardView === "stack" && " lg:w-3/5")}>
            <AboutSection />
          </Card>
          {/* <TierCardData profile={profile} /> */}

          {cardView === "stack" && <TierCardData profile={profile} isStacked />}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
