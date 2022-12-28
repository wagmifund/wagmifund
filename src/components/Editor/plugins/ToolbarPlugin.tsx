import BoldIcon from "@icons/type-bold";
import ItalicIcon from "@icons/type-italic";
import { CodeIcon } from "@heroicons/react/outline";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import Button from "@components/Button";
import { ProfileUIState, useProfileUIStore } from "@store/profile";
import { useAppStore } from "@store/app";
import toast from "react-hot-toast";
import { LENS_PERIPHERY, RELAY_ON, SIGN_WALLET } from "@utils/constants";
import uploadToArweave from "@utils/uploadToArweave";
import {
  CreatePublicSetProfileMetadataUriRequest,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation,
} from "generated";
import { useContractWrite, useSignTypedData } from "wagmi";
import useBroadcast from "@utils/useBroadcast";
import onError from "@utils/onError";
import { LensPeriphery } from "@abis/LensPeriphery";
import { splitSignature } from "ethers/lib/utils.js";
import getSignature from "@utils/getSignature";
import { Loader } from "@components/Loader";

const ToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsCode(selection.hasFormat("code"));
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  const currentProfile = useAppStore((state) => state.currentProfile);
  const [isUploading, setIsUploading] = useState(false);

  const setUISettings = useProfileUIStore((state) => state.setUISettings);

  const onCompleted = () => {
    toast.success("Profile updated successfully!");
    setUISettings(false);
    setIsUploading(false);
  };
  const { broadcast } = useBroadcast({ onCompleted });

  const { signTypedDataAsync } = useSignTypedData({
    onError,
  });

  const { write } = useContractWrite({
    address: LENS_PERIPHERY,
    abi: LensPeriphery,
    functionName: "setProfileMetadataURIWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
    onError,
  });

  const [createSetProfileMetadataTypedData] =
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
        } catch {
          setIsUploading(false);
        }
      },
      onError,
    });

  const [createSetProfileMetadataViaDispatcher] =
    useCreateSetProfileMetadataViaDispatcherMutation({
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
          key: "gradient",
          value: profileUIData?.gradient?.toString(),
        },
        {
          traitType: "string",
          key: "about",
          value: profileUIData?.about?.toString(),
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

  const profileUIData = useProfileUIStore((state) => state.profileUIData);

  return (
    <div className="w-full px-5 py-2 flex toolbar-icons border-b-theme border-b justify-between space-x-1">
      <div className="flex">
        <button
          className={isBold ? "bg-theme-darker" : ""}
          title="Bold"
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
        >
          <BoldIcon className="onboard-icon" />
        </button>
        <button
          className={isItalic ? "bg-theme-darker" : ""}
          title="Italic"
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
        >
          <ItalicIcon className="onboard-icon" />
        </button>
        <button
          className={isCode ? "bg-theme-darker" : ""}
          title="Code"
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
          }}
        >
          <CodeIcon className="onboard-icon h-4" />
        </button>
      </div>
      <Button
        className="btn-sm !text-white"
        onClick={() => editProfile(profileUIData)}
        disabled={isUploading}
      >
        <span className="mr-1">{isUploading && <Loader size="sm" />}</span>
        save
      </Button>
    </div>
  );
};

export default ToolbarPlugin;
