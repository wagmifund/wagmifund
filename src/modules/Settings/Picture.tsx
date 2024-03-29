// import IndexStatus from "@components/Shared/IndexStatus";
import { Button } from "@components/Button";
import useBroadcast from "@utils/useBroadcast";
import { PencilIcon } from "@heroicons/react/outline";
import getIPFSLink from "@utils/getIPFSLink";
import getSignature from "@utils/getSignature";
import imageProxy from "@utils/imageProxy";
import onError from "@utils/onError";
import splitSignature from "@utils/splitSignature";
import uploadToIPFS from "@utils/uploadToIPFS";
import { LensHubProxy } from "@abis/LensHubProxy";
import { LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from "@utils/constants";
import type {
  MediaSet,
  NftImage,
  Profile,
  UpdateProfileImageRequest,
} from "generated";
import {
  useCreateSetProfileImageUriTypedDataMutation,
  useCreateSetProfileImageUriViaDispatcherMutation,
} from "generated";
import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppStore } from "src/store/app";
import { useContractWrite, useSignTypedData } from "wagmi";
import { Loader } from "@components/Loader";

interface Props {
  profile: Profile & { picture: MediaSet & NftImage };
}

const Picture: FC<Props> = ({ profile }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError,
  });

  const onCompleted = () => {
    toast.success("Avatar updated successfully!");
  };

  const {
    isLoading: writeLoading,
    error,
    write,
  } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: "setProfileImageURIWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
    onError,
  });

  useEffect(() => {
    if (profile?.picture?.original?.url || profile?.picture?.uri) {
      setAvatar(profile?.picture?.original?.url ?? profile?.picture?.uri);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { broadcast, loading: broadcastLoading } = useBroadcast({
    onCompleted,
  });
  const [createSetProfileImageURITypedData, { loading: typedDataLoading }] =
    useCreateSetProfileImageUriTypedDataMutation({
      onCompleted: async ({ createSetProfileImageURITypedData }) => {
        try {
          const { id, typedData } = createSetProfileImageURITypedData;
          const { profileId, imageURI, deadline } = typedData.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            profileId,
            imageURI,
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
    createSetProfileImageURIViaDispatcher,
    { loading: dispatcherLoading },
  ] = useCreateSetProfileImageUriViaDispatcherMutation({
    onCompleted,
    onError,
  });

  const createViaDispatcher = async (request: UpdateProfileImageRequest) => {
    const { data } = await createSetProfileImageURIViaDispatcher({
      variables: { request },
    });
    if (
      data?.createSetProfileImageURIViaDispatcher?.__typename === "RelayError"
    ) {
      createSetProfileImageURITypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request,
        },
      });
    }
  };

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setUploading(true);
    try {
      const attachment = await uploadToIPFS(evt.target.files);
      if (attachment[0]?.item) {
        setAvatar(attachment[0].item);
      }
    } finally {
      setUploading(false);
    }
  };

  const editPicture = (avatar?: string) => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    if (!avatar) {
      return toast.error("Avatar can't be empty!");
    }

    const request = {
      profileId: currentProfile?.id,
      url: avatar,
    };

    if (currentProfile?.dispatcher?.canUseRelay) {
      createViaDispatcher(request);
    } else {
      createSetProfileImageURITypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request,
        },
      });
    }
  };

  const isLoading =
    typedDataLoading ||
    dispatcherLoading ||
    signLoading ||
    writeLoading ||
    broadcastLoading;
  // const txHash =
  //   writeData?.hash ??
  //   broadcastData?.broadcast?.txHash ??
  //   (dispatcherData?.createSetProfileImageURIViaDispatcher.__typename ===
  //     "RelayerResult" &&
  //     dispatcherData?.createSetProfileImageURIViaDispatcher.txHash);

  return (
    <>
      <div className="space-y-1.5">
        {error && <p> error message</p>}
        <div className="space-y-3">
          {avatar && (
            <div>
              <img
                className="w-60 h-60 rounded-lg"
                height={240}
                width={240}
                src={imageProxy(getIPFSLink(avatar), "avatar")}
                alt={avatar}
              />
            </div>
          )}
          <div className="flex items-center space-x-3">
            <input
              className="input h-[50px] p-[9px] cursor-pointer"
              type="file"
              accept=".png, .jpg, .jpeg, .gif"
              onChange={(evt) => {
                handleUpload(evt);
              }}
            />
            {uploading && <Loader size="sm" />}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Button
          className="ml-auto"
          type="submit"
          disabled={isLoading}
          onClick={() => editPicture(avatar)}
          icon={
            isLoading ? (
              <Loader size="sm" className="mr-1" />
            ) : (
              <PencilIcon className="w-4 h-4 mr-1" />
            )
          }
        >
          Save
        </Button>
        {/* {txHash ? <IndexStatus txHash={txHash} /> : null} */}
      </div>
    </>
  );
};

export default Picture;
