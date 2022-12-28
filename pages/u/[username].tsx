import AboutSection from "@components/AboutSection";
import { Card } from "@components/Card";
import CoverPicture from "@components/CoverPicture";
import ProfilePicture from "@components/ProfilePicture";
import { tier, TierCards } from "@components/TierCard";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import ProfileEditor from "@components/ProfileEditor";
import {
  CreatePublicSetProfileMetadataUriRequest,
  Profile,
  PublicationTypes,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation,
  useProfileFeedQuery,
  useProfileQuery,
} from "generated";
import { useRouter } from "next/router";
import { useAppStore } from "@store/app";
import TierCardData from "@components/TierCardData";
import { ProfileUIState, useProfileUIStore } from "@store/profile";
import PageLoader from "@components/PageLoader";
import Button from "@components/Button";
import uploadToArweave from "@utils/uploadToArweave";
import toast from "react-hot-toast";
import { LENS_PERIPHERY, RELAY_ON, SIGN_WALLET } from "@utils/constants";
import useBroadcast from "@utils/useBroadcast";
import { useContractWrite, useSignTypedData } from "wagmi";
import onError from "@utils/onError";
import { LensPeriphery } from "@abis/LensPeriphery";
import splitSignature from "@utils/splitSignature";
import getSignature from "@utils/getSignature";
import IndexStatus from "@components/Shared/IndexStatus";
import wantsGradient from "@utils/profileAttributes";
import { useProfileTierStore } from "@store/profile-tiers";
import { usePublicationStore } from "@store/publication";
import { NotFoundPage } from "@modules/Error/NotFoundPage";

const ProfilePage = () => {
  const setUISettings = useProfileUIStore((state) => state.setUISettings);

  const onCompleted = () => {
    toast.success("Profile updated successfully!");
    setUISettings(false);
  };
  const {
    broadcast,
    data: broadcastData,
    loading: broadcastLoading,
  } = useBroadcast({ onCompleted });

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError,
  });

  const {
    data: writeData,
    isLoading: writeLoading,
    error: Errr,
    write,
  } = useContractWrite({
    address: LENS_PERIPHERY,
    abi: LensPeriphery,
    functionName: "setProfileMetadataURIWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
    onError,
  });

  const [createSetProfileMetadataTypedData, { loading: typedDataLoading }] =
    useCreateSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createSetProfileMetadataTypedData }) => {
        try {
          const { id, typedData } = createSetProfileMetadataTypedData;
          const { profileId, metadata, deadline } = typedData.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          console.log("currentProfile", currentProfile);
          const inputStruct = {
            user: currentProfile?.ownedBy,
            profileId,
            metadata,
            sig,
          };
          // setUserSigNonce(userSigNonce + 1);
          if (!RELAY_ON) {
            return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
          }

          const {
            data: { broadcast: result },
          } = await broadcast({ request: { id, signature } });

          if ("reason" in result) {
            write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
          }
        } catch {}
      },
      onError,
    });

  const [
    createSetProfileMetadataViaDispatcher,
    { data: dispatcherData, loading: dispatcherLoading },
  ] = useCreateSetProfileMetadataViaDispatcherMutation({
    onCompleted,
    onError,
  });

  const createViaDispatcher = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => {
    const { data } = await createSetProfileMetadataViaDispatcher({
      variables: { request },
    });
    if (
      data?.createSetProfileMetadataViaDispatcher?.__typename === "RelayError"
    ) {
      createSetProfileMetadataTypedData({
        variables: {
          // options: { overrideSigNonce: userSigNonce },
          request,
        },
      });
    }
  };
  const { cardView, theme, corners, gradient } = useProfileUIStore(
    (state) => state.profileUIData
  );
  const profileUIData = useProfileUIStore((state) => state.profileUIData);
  const showUISettings = useProfileUIStore((state) => state.showUISettings);
  const setProfileUIData = useProfileUIStore((state) => state.setProfileUIData);

  useEffect(() => {
    console.log(corners);
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
    query: { username, type },
  } = useRouter();
  const isEditable = currentProfile?.handle === username;
  const { data, loading, error } = useProfileQuery({
    variables: {
      request: { handle: username },
      who: currentProfile?.id ?? null,
    },
    skip: !username,
    onCompleted: ({ profile: userUIData }) => {
      console.log(Object.values(userUIData?.attributes), "acc");
      Object.values(userUIData?.attributes).forEach(({ key, value }, idx) => {
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
  // store the value
  if (profile && profile?.attributes?.length) {
    const test = Object.values(profile?.attributes).reduce(
      (acc: Array<Object>, attribute, idx) => {
        if (attribute.key in profileUIData) {
          acc.push({ key: attribute.key, value: attribute.value });
        }
        return acc;
      },
      []
    );
  }

  if (loading || !profile) {
    return <PageLoader />;
  }

  if (!profile) {
    return <NotFoundPage />;
  }

  return (
    <>
      <div
        className="w-full z-1 bg-[#0d1933] text-white flex flex-grow px-4 sm:px-8 flex-col mb-[80px] md:mb-[150px]"
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
          <CoverPicture />
          <div className="absolute -bottom-8 left-1/2 -translate-x-[71px] z-10">
            <ProfilePicture profile={profile} />
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
        {cardView === "card" && (
          <ProfilePageTierCard layout="default" profile={profile} />
        )}
        <div
          className={clsx(
            "flex lg:flex-nowrap flex-wrap-reverse w-full md:w-[80%] mt-5 mx-auto",
            cardView === "card"
          )}
        >
          {profileUIData?.about ? (
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
  const mediaFeedFilters = useProfileTierStore(
    (state) => state.mediaTierFilters
  );

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
    limit: 10,
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
        const filterTierItems = Tierattributes?.filter(
          (tier) => tier.appId === "wagmifund"
        );
        setPublications(filterTierItems);
      }
    },
  });

  const Tierattributes = data?.publications.items;
  const filterTierItems = Tierattributes?.filter(
    (tier) => tier.appId === "wagmifund"
  );

  const tiers = filterTierItems?.map((tier) => ({
    ...tier.metadata.attributes.reduce(
      (acc, { traitType, value }) => ({
        ...acc,
        [traitType as string]: value,
        id: tier.id,
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
