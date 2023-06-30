import AboutSection from "@components/AboutSection";
import { Card } from "@components/Card";
import CoverPicture from "@components/CoverPicture";
import ProfilePicture from "@components/ProfilePicture";
import { tier } from "@components/TierCard";
import { clsx } from "clsx";
import { useEffect } from "react";
import ProfileEditor from "@components/ProfileEditor";
import {
  Profile,
  PublicationTypes,
  useProfileFeedQuery,
  useProfileQuery,
} from "generated";
import { useRouter } from "next/router";
import { useAppStore } from "@store/app";
import TierCardData from "@components/TierCardData";
import { useProfileUIStore } from "@store/profile";
import PageLoader from "@components/PageLoader";
import { usePublicationStore } from "@store/publication";
import { NotFoundPage } from "@modules/Error/NotFoundPage";
import { GlobeAltIcon } from "@heroicons/react/outline";
import { TwitterIcon } from "@icons/socials";
import getAttribute from "@utils/getAttribute";
import MetaTags from "@components/MetaTags";
import formatHandle from "@utils/formatHandle";
import { SuperfluidSubscribe } from "@components/SuperfluidSubscribe";

const ProfilePage = () => {
  const { cardView, theme, corners, gradient } = useProfileUIStore(
    (state) => state.profileUIData
  );
  const profileUIData = useProfileUIStore((state) => state.profileUIData);
  const setProfileUIData = useProfileUIStore((state) => state.setProfileUIData);
  useEffect(() => {
    document
      .querySelector('[data-theme="user"]')
      ?.style.setProperty("--rounded-box", `${corners}rem`);
    const { h, s, l } = theme;
    document
      .querySelector('[data-theme="user"]')
      ?.style.setProperty("--p", `${h} ${s * 100}% ${l * 100}%`);
  }, [theme, corners]);

  const currentProfile = useAppStore((state) => state.currentProfile);

  const {
    query: { username },
  } = useRouter();
  const isEditable = currentProfile?.handle === username;
  const { data, loading, error } = useProfileQuery({
    variables: {
      request: { handle: username },
      who: currentProfile?.id ?? null,
    },
    skip: !username,
    onCompleted: ({ profile: userUIData }) => {
      Object.values(userUIData?.attributes).forEach(({ key, value }) => {
        if (key in profileUIData) {
          setProfileUIData({
            [key]: key === "theme" ? JSON.parse(value) : value,
          });
        }
      });
    },
  });
  const profile = data?.profile;

  if (error) {
    return <div />;
  }

  if (loading || !data) {
    return <PageLoader />;
  }

  if (!profile) {
    return <NotFoundPage />;
  }

  const twitterProfile = getAttribute(profile?.attributes, "twitter");
  const websiteLink = getAttribute(profile?.attributes, "website");

  return (
    <>
      {profile?.name ? (
        <MetaTags
          title={`${profile?.name} (@${formatHandle(
            profile?.handle
          )}) • Wagmi Fund`}
        />
      ) : (
        <MetaTags title={`@${formatHandle(profile?.handle)} • Wagmi Fund`} />
      )}
      <div
        className="w-full z-1 bg-black text-white flex flex-grow px-4 sm:px-8 flex-col mb-[80px] md:mb-[150px]"
        data-theme="user"
      >
        {isEditable && <ProfileEditor />}

        {gradient === "true" && (
          <>
            <span className="bg-gradient-sides left"></span>
            <span className="bg-gradient-sides right"></span>
          </>
        )}

        <div className="relative sm:min-h-[300px]">
          <CoverPicture cover={profile?.coverPicture?.original?.url} />
          <div className="absolute -bottom-8 left-1/2 -translate-x-[71px] z-10">
            <ProfilePicture profile={profile} />
          </div>
          {(twitterProfile || websiteLink) && (
            <div className="absolute ring-1 ring-gray-100 bg-gray-200/10 bottom-5 right-5 z-10 backdrop-blur-xl bg-[rgba(25,_28,_31,_0.2] rounded-lg flex items-center justify-center">
              {websiteLink && (
                <a
                  className="flex justify-center items-center m-2 space-x-1"
                  href={websiteLink}
                >
                  <GlobeAltIcon className="h-6 w-6 " />{" "}
                  <p className="hidden lg:block">{websiteLink}</p>
                </a>
              )}
              {twitterProfile && (
                <a
                  href={`https://twitter.com/${twitterProfile}`}
                  className="m-2"
                >
                  <TwitterIcon className="h-6 w-6" />
                </a>
              )}
            </div>
          )}
        </div>
        <div className="text-center">
          <div className=" font-space-grotesek font-bold text-4xl mt-10">
            {profile.name}
          </div>
          <SuperfluidSubscribe
            profile={profile}
            // name={profile?.handle}
            // description={profile?.bio}
            // imageURI={getAvatar(profile as Profile)}
            // successURL=""
          />
          <div className=" font-space-grotesek font-semibold text-lg mt-2">
            {profile.handle}
          </div>
          <div className="font-space-grotesek font-medium mt-3">
            {profile.bio}
          </div>
        </div>
        {cardView === "card" && (
          <ProfilePageTierCard layout="default" profile={profile} />
        )}
        <div
          className={clsx(
            "flex lg:flex-nowrap flex-wrap-reverse w-full md:w-[80%] mt-5 mx-auto",
            cardView === "card"
          )}
        >
          {getAttribute(profile.attributes, "about") ? (
            <Card
              className={clsx(
                "w-full min-h-[390px] h-full",
                cardView === "stack" && " lg:w-3/5"
              )}
            >
              <AboutSection />
            </Card>
          ) : username === currentProfile?.handle ? (
            <Card
              className={clsx(
                "w-full min-h-[390px] h-full",
                cardView === "stack" && " lg:w-3/5"
              )}
            >
              <AboutSection />
            </Card>
          ) : null}
          {cardView === "stack" && (
            <ProfilePageTierCard profile={profile} layout="stack" />
          )}
        </div>
      </div>
    </>
  );
};

const ProfilePageTierCard = ({
  layout,
  profile,
}: {
  layout: "stack" | "collection" | "default";
  profile: Profile;
}) => {
  const type = "NEW_POST";
  const publicationTypes =
    type === "NEW_POST"
      ? [PublicationTypes.Post, PublicationTypes.Mirror]
      : type === "MEDIA"
      ? [PublicationTypes.Post, PublicationTypes.Comment]
      : [PublicationTypes.Comment];
  const metadata = null;
  const setPublications = usePublicationStore((state) => state.setPublications);

  const request = {
    publicationTypes,
    metadata,
    profileId: profile?.id,
    sources: ["wagmifund"],
    limit: 5,
  };
  const reactionRequest = profile ? { profileId: profile?.id } : null;
  const profileId = profile?.id ?? null;
  const {
    query: { username },
  } = useRouter();
  const {
    data,
    refetch,
    loading: loadingTiers,
  } = useProfileFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: false,
    onCompleted: (data) => {
      if (profile?.handle !== username) {
        const Tierattributes = data?.publications.items;
        setPublications(Tierattributes);
      }
    },
  });

  const Tierattributes = data?.publications.items;

  const tiers = Tierattributes?.map((tier) => ({
    ...tier.metadata.attributes.reduce(
      (acc, { traitType, value }) => ({
        ...acc,
        [traitType as string]: value,
        id: tier?.id,
      }),
      {}
    ),
  })) as Array<tier>;
  return layout === "stack" ? (
    <TierCardData
      loadingTiers={loadingTiers}
      onMetaClick={refetch}
      profile={profile}
      layout="stack"
      tiers={tiers}
    />
  ) : (
    <TierCardData
      loadingTiers={loadingTiers}
      onMetaClick={() => {}}
      layout="collection"
      profile={profile}
      tiers={tiers}
    />
  );
};

export default ProfilePage;
