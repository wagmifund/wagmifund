import { ChevronRightIcon, CogIcon } from "@heroicons/react/outline";
import { v4 as uuid } from "uuid";
import { LENS_PERIPHERY, RELAY_ON, SIGN_WALLET } from "@utils/constants";
import { ProfileUIState, useProfileUIStore } from "@store/profile";
import { useEffect, useState } from "react";
import AppearAnimation from "./AnimatedAppear";
import { useContractWrite, useSignTypedData } from "wagmi";
import onError from "@utils/onError";
import { Button } from "./Button";
import ColorPicker from "./ColorPicker";
import toast, { LoaderIcon } from "react-hot-toast";
import { useAppStore } from "@store/app";
import uploadToArweave from "@utils/uploadToArweave";
import {
  CreatePublicSetProfileMetadataUriRequest,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation,
} from "generated";
import getSignature from "@utils/getSignature";
import splitSignature from "@utils/splitSignature";
import { LensPeriphery } from "@abis/LensPeriphery";
import useBroadcast from "@utils/useBroadcast";
import Analytics from "@utils/analytics";

const ProfileEditor = () => {
  const setProfileUIData = useProfileUIStore((state) => state.setProfileUIData);
  const profileUIData = useProfileUIStore((state) => state.profileUIData);
  const [cover, setCover] = useState("");
  const gradient = useProfileUIStore((state) => state.profileUIData.gradient);
  const customColor = useProfileUIStore(
    (state) => state.profileUIData.theme
  ) ?? {
    h: "198",
    s: "0.94",
    l: "0.43",
  };
  const currentRadius = useProfileUIStore(
    (state) => state.profileUIData.corners
  );

  const showUISettings = useProfileUIStore((state) => state.showUISettings);
  const setUISettings = useProfileUIStore((state) => state.setUISettings);
  const [isUploading, setIsUploading] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);

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

  const onCompleted = () => {
    toast.success("Profile updated successfully!");
    setUISettings(false);
  };
  const [
    createSetProfileMetadataViaDispatcher,
    { loading: dispatcherLoading },
  ] = useCreateSetProfileMetadataViaDispatcherMutation({
    onCompleted,
    onError,
  });

  const { isLoading: writeLoading, write } = useContractWrite({
    address: LENS_PERIPHERY,
    abi: LensPeriphery,
    functionName: "setProfileMetadataURIWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
    onError,
  });
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError,
  });
  const { broadcast, loading: broadcastLoading } = useBroadcast({
    onCompleted,
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
  useEffect(() => {
    if (currentProfile?.coverPicture?.original?.url) {
      setCover(currentProfile?.coverPicture?.original?.url);
    }
  }, []);
  const editProfile = async (profileUIData?: ProfileUIState) => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    setIsUploading(true);
    const id = await uploadToArweave({
      name: currentProfile?.name,
      bio: currentProfile?.bio,
      cover_picture: cover ? cover : null,
      attributes: [
        ...(currentProfile?.attributes
          ?.filter(
            (attr) =>
              !["cardView", "corners", "gradient", "theme"].includes(attr.key)
          )
          .map(({ traitType, key, value }) => ({ traitType, key, value })) ??
          []),
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
      metadata_id: uuid(),
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

  return showUISettings ? (
    <div>
      <AppearAnimation className="fixed right-0 top-1/4 w-[168px] z-20 bg-slate-900 ring-1 rounded-2xl text-white transition-150 mr-1 p-4">
        <Button
          className="text-primary flex justify-evenly bg-transparent border-transparent lowercase hover:bg-transparent mx-auto"
          onClick={() => {
            setUISettings(false);
          }}
        >
          <p className="text-white">minimize</p>
          <div className="h-6 w-6">
            <ChevronRightIcon />
          </div>
        </Button>
        <div className="flex flex-col items-center">
          Accent color
          <div className="flex flex-wrap">
            <ColorPicker
              colors={[
                "hsl(189 94% 43%)",
                "hsl(330 81% 60%)",
                "hsl(258 90% 66%)",
                "hsl(341 81% 54%)",
                "hsl(290 43% 53%)",
                "hsl(212 92% 56%)",
                "hsl(38 100% 59%)",
                "hsl(159 94% 43%)",
              ]}
              customColor={customColor}
              onChange={(changedColor: { hsl: { h: any; s: any; l: any } }) => {
                const { h, s, l } = changedColor.hsl;

                setProfileUIData({ theme: changedColor.hsl });
                document
                  .querySelector('[data-theme="user"]')
                  ?.style.setProperty("--p", `${h} ${s * 100}% ${l * 100}%`);
              }}
            />
          </div>
          Curvedness
          <div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.1"
              value={currentRadius}
              className="range range-xs"
              onChange={(e) => {
                setProfileUIData({ corners: e.target.value });
                document
                  .querySelector('[data-theme="user"]')
                  ?.style.setProperty("--rounded-box", `${e.target.value}rem`);
              }}
            />
          </div>
          <p className="mt-2">Tiers view</p>
          <div className="flex justify-between space-x-2">
            <Button
              className="btn-sm"
              onClick={() =>
                setProfileUIData({
                  cardView: "stack",
                })
              }
            >
              Stack
            </Button>
            <Button
              className="btn-sm"
              onClick={() =>
                setProfileUIData({
                  cardView: "card",
                })
              }
            >
              Card
            </Button>
          </div>
          <div className="flex justify-center h-10 mt-4">
            Gradient
            <input
              type="checkbox"
              className="toggle ml-2 bg-primary"
              checked={gradient === "true"}
              onChange={() => {
                setProfileUIData({
                  gradient: `${gradient === "true" ? "false" : "true"}`,
                });
              }}
            />
          </div>
          <Button
            onClick={() => {
              Analytics.track("save profile ui settings");
              editProfile(profileUIData);
            }}
            className="ml-4 btn-sm"
            disabled={isLoading}
          >
            Save {isLoading && <LoaderIcon className="h-6 w-6 ml-2" />}
          </Button>
        </div>
      </AppearAnimation>
    </div>
  ) : (
    <Button
      className="fixed right-0 top-1/2 bg-slate-900 ring-1 h-12 w-12 p-2 rounded-l-2xl z-[11]"
      onClick={() => setUISettings(true)}
    >
      <CogIcon />
    </Button>
  );
};

export default ProfileEditor;
