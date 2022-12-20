import AboutSection from "@components/AboutSection";
import { Card } from "@components/Card";
import CoverPicture from "@components/CoverPicture";
import ProfilePicture from "@components/ProfilePicture";
import { StackedTierCard, TierCards } from "@components/TierCard";
import ColorPicker from "@components/ColorPicker";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import ProfileEditor from "@components/ProfileEditor";
import {
  CreatePublicSetProfileMetadataUriRequest,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation,
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
const ProfilePage = ({ isEditable = true }) => {
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
  const [isUploading, setIsUploading] = useState(false);

  console.log("profileUIData", profileUIData);

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
  // store the value
  if (profile && profile?.attributes?.length) {
    const test = Object.values(profile?.attributes).map((attribute, idx) => {
      if (attribute.key in profileUIData) {
        return attribute.value;
      }
    });

    console.log("test", test);
  }

  if (
    loading ||
    (!data &&
      profile?.attributes?.filter(({ key }) => key === "about")?.[0]?.value
        ?.length)
  ) {
    return <PageLoader />;
  }

  if (!profile) {
    return <div>404 page</div>;
  }

  const editProfile = async (profileUIData?: ProfileUIState) => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    setIsUploading(true);
    const id = await uploadToArweave({
      name: currentProfile?.name,
      bio: currentProfile?.bio,
      cover_picture:
        "https://1.bp.blogspot.com/-CbWLumSsnHA/X3NCN8Y97SI/AAAAAAAAbdM/6_nItNbt0jcQvkFzogyKeqUGJjMyM57rACLcBGAsYHQ/s16000/v3-290920-rocket-minimalist-desktop-wallpaper-hd.png",

      // cover_picture: cover ? cover : null,
      attributes: [
        { traitType: "string", key: "app_name", value: "wagmifund" },
        {
          traitType: "string",
          key: "cardView",
          value: profileUIData?.cardView,
        },
        {
          traitType: "string",
          key: "corners",
          value: profileUIData?.corners,
        },
        {
          traitType: "string",
          key: "snow",
          value: profileUIData?.snow?.toString(),
        },
        {
          traitType: "string",
          key: "gradient",
          value: profileUIData?.gradient?.toString(),
        },
        {
          traitType: "string",
          key: "theme",
          value: JSON.stringify(profileUIData?.theme),
        },
      ],
      version: "1.0.0",
      metadata_id: Math.random(),
      createdOn: new Date(),
      appId: "wagmifund",
    }).finally(() => {
      setIsUploading(false);
    });

    const request = {
      profileId: currentProfile?.id,
      metadata: `https://arweave.net/${id}`,
    };
    if (currentProfile?.dispatcher?.canUseRelay) {
      createViaDispatcher(request);
    } else {
      createSetProfileMetadataTypedData({
        variables: {
          request,
        },
      });
    }
  };

  const isLoading =
    isUploading ||
    typedDataLoading ||
    dispatcherLoading ||
    signLoading ||
    writeLoading ||
    broadcastLoading;
  const txHash =
    writeData?.hash ??
    broadcastData?.broadcast?.txHash ??
    (dispatcherData?.createSetProfileMetadataViaDispatcher.__typename ===
      "RelayerResult" &&
      dispatcherData?.createSetProfileMetadataViaDispatcher.txHash);

  return (
    <>
      <div
        className="w-full z-1 bg-[#0d1933] text-white flex flex-grow px-4 sm:px-8 flex-col"
        data-theme="user"
      >
        {isEditable && <ProfileEditor />}

        {gradient && (
          <>
            <span className="bg-gradient-sides left"></span>
            <span className="bg-gradient-sides right"></span>
          </>
        )}

        <div className="relative sm:min-h-[300px]">
          <CoverPicture />
          <div className="absolute -bottom-8 left-1/2 -translate-x-[71px] z-10">
            <ProfilePicture />
          </div>
        </div>
        <div className="text-center">
          <div className=" font-space-grotesek font-bold text-4xl mt-10">
            {profile.name}
            {showUISettings && (
              <Button
                onClick={() => editProfile(profileUIData)}
                className="ml-4"
              >
                Save
              </Button>
            )}
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
          {cardView === "stack" && <TierCardData profile={profile} isStacked />}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
