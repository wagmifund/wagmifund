import IndexStatus from "@components/Shared/IndexStatus";
import { Button } from "@components/Button";
import { Card } from "@components/Card";
import { Form, useZodForm } from "@components/Form";
// import { Input } from "@components/UI/Input";
import { Spinner } from "@components/Spinner";
// import { TextArea } from "@components/UI/TextArea";
import useBroadcast from "@utils/useBroadcast";
import { PencilIcon } from "@heroicons/react/outline";
import getAttribute from "@utils/getAttribute";
import getIPFSLink from "@utils/getIPFSLink";
import getSignature from "@utils/getSignature";
import imageProxy from "@utils/imageProxy";
import onError from "@utils/onError";
import splitSignature from "@utils/splitSignature";
import uploadToArweave from "@utils/uploadToArweave";
// import uploadToIPFS from "@utils/uploadToIPFS";
import { LensPeriphery } from "@abis/LensPeriphery";
import { v4 as uuid } from "uuid";

import {
  APP_NAME,
  LENS_PERIPHERY,
  RELAY_ON,
  SIGN_WALLET,
  URL_REGEX,
} from "@utils/constants";
import type {
  CreatePublicSetProfileMetadataUriRequest,
  MediaSet,
} from "generated";
import {
  Profile,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation,
} from "generated";
import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppStore } from "src/store/app";
import { useContractWrite, useSignTypedData } from "wagmi";
import { object, string, union } from "zod";
import { TextArea } from "@components/TextArea";
import { Input } from "@components/Input";

const editProfileSchema = object({
  name: string().max(100, { message: "Name should not exceed 100 characters" }),
  location: string().max(100, {
    message: "Location should not exceed 100 characters",
  }),
  website: union([
    string().regex(URL_REGEX, { message: "Invalid website" }),
    string().max(0),
  ]),
  twitter: string().max(100, {
    message: "Twitter should not exceed 100 characters",
  }),
  bio: string().max(260, { message: "Bio should not exceed 260 characters" }),
});

interface Props {
  profile: Profile & { coverPicture: MediaSet };
}

const Profile: FC<Props> = ({ profile }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  //   const [pride, setPride] = useState(hasPrideLogo(profile));
  const [cover, setCover] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onCompleted = () => {
    toast.success("Profile updated successfully!");
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError,
  });

  const {
    data: writeData,
    isLoading: writeLoading,
    error,
    write,
  } = useContractWrite({
    address: LENS_PERIPHERY,
    abi: LensPeriphery,
    functionName: "setProfileMetadataURIWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
    onError,
  });

  const {
    broadcast,
    data: broadcastData,
    loading: broadcastLoading,
  } = useBroadcast({ onCompleted });
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

          setUserSigNonce(userSigNonce + 1);
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
          options: { overrideSigNonce: userSigNonce },
          request,
        },
      });
    }
  };

  useEffect(() => {
    if (profile?.coverPicture?.original?.url) {
      setCover(profile?.coverPicture?.original?.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setUploading(true);
    try {
      //   const attachment = await uploadToIPFS(evt.target.files);
      //   if (attachment[0]?.item) {
      //     setCover(attachment[0].item);
      //   }
    } finally {
      setUploading(false);
    }
  };

  const form = useZodForm({
    schema: editProfileSchema,
    defaultValues: {
      name: profile?.name ?? "",
      location: getAttribute(profile?.attributes, "location"),
      website: getAttribute(profile?.attributes, "website"),
      twitter: getAttribute(profile?.attributes, "twitter")?.replace(
        "https://twitter.com/",
        ""
      ),
      bio: profile?.bio ?? "",
    },
  });

  const editProfile = async (
    name: string,
    location: string | null,
    website?: string | null,
    twitter?: string | null,
    bio?: string | null
  ) => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    setIsUploading(true);
    const id = await uploadToArweave({
      name,
      bio,
      cover_picture: cover ? cover : null,
      attributes: [
        { traitType: "string", key: "location", value: location },
        { traitType: "string", key: "website", value: website },
        { traitType: "string", key: "twitter", value: twitter },
        { traitType: "string", key: "app", value: APP_NAME },
      ],
      version: "1.0.0",
      metadata_id: uuid(),
      createdOn: new Date(),
      appId: APP_NAME,
    }).finally(() => setIsUploading(false));

    const request = {
      profileId: currentProfile?.id,
      metadata: `https://arweave.net/${id}`,
    };

    if (currentProfile?.dispatcher?.canUseRelay) {
      createViaDispatcher(request);
    } else {
      createSetProfileMetadataTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
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
    <Card className="p-5">
      <Form
        form={form}
        className="space-y-4"
        onSubmit={({ name, location, website, twitter, bio }: any) => {
          editProfile(name, location, website, twitter, bio);
        }}
      >
        {error && <p>error message</p>}
        <Input
          label="Profile Id"
          type="text"
          value={currentProfile?.id}
          disabled
        />
        <Input
          label="Name"
          type="text"
          placeholder="Gavin"
          {...form.register("name")}
        />
        <Input
          label="Location"
          type="text"
          placeholder="Miami"
          {...form.register("location")}
        />
        <Input
          label="Website"
          type="text"
          placeholder="https://hooli.com"
          {...form.register("website")}
        />
        <Input
          label="Twitter"
          type="text"
          prefix="https://twitter.com"
          placeholder="gavin"
          {...form.register("twitter")}
        />
        <TextArea
          label="Bio"
          placeholder="Tell us something about you!"
          {...form.register("bio")}
        />
        <div className="space-y-1.5">
          <div className="label">Cover</div>
          <div className="space-y-3">
            {cover && (
              <div>
                <img
                  className="object-cover w-full h-60 rounded-lg"
                  src={imageProxy(getIPFSLink(cover), "cover")}
                  alt={cover}
                />
              </div>
            )}
            <div className="flex items-center space-x-3">
              <input
                className="input h-[50px] p-[9px] cursor-pointer"
                type="file"
                accept=".png, .jpg, .jpeg, .gif"
                onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                  handleUpload(evt)
                }
              />
              {uploading && <Spinner size="sm" />}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Button
            className="ml-auto"
            type="submit"
            disabled={isLoading}
            // icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="w-4 h-4" />}
          >
            Save
          </Button>
          {txHash ? <IndexStatus txHash={txHash} /> : null}
        </div>
      </Form>
    </Card>
  );
};

export default Profile;
