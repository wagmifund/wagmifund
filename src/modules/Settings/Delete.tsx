import { Button } from "@components/Button";
import { Card } from "@components/Card";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
} from "@components/GridLayout";
import Modal from "@components/Modal";
import { Spinner } from "@components/Spinner";
import { WarningMessage } from "@modules/Settings/WarningMessage";
import { ExclamationIcon, TrashIcon } from "@heroicons/react/outline";
import getSignature from "@utils/getSignature";
import onError from "@utils/onError";
import resetAuthData from "@utils/resetAuthData";
import splitSignature from "@utils/splitSignature";
import { LensHubProxy } from "@abis/LensHubProxy";
import { APP_NAME, LENSHUB_PROXY, SIGN_WALLET } from "@utils/constants";
import { useCreateBurnProfileTypedDataMutation } from "generated";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAppPersistStore, useAppStore } from "src/store/app";
import { useContractWrite, useDisconnect, useSignTypedData } from "wagmi";

import Sidebar from "@modules/Settings/Sidebar";
import { NotFoundPage } from "@modules/Error/NotFoundPage";

const DeleteSettings: FC = () => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError,
  });
  const { disconnect } = useDisconnect();

  const onCompleted = () => {
    setCurrentProfile(null);
    setProfileId(null);
    resetAuthData();
    disconnect?.();
    location.href = "/";
  };

  const { isLoading: writeLoading, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: "burnWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
    onError,
  });

  const [createBurnProfileTypedData, { loading: typedDataLoading }] =
    useCreateBurnProfileTypedDataMutation({
      onCompleted: async ({ createBurnProfileTypedData }) => {
        try {
          const { typedData } = createBurnProfileTypedData;
          const { tokenId, deadline } = typedData.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };

          setUserSigNonce(userSigNonce + 1);
          write?.({ recklesslySetUnpreparedArgs: [tokenId, sig] });
        } catch {}
      },
      onError,
    });

  const handleDelete = () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    createBurnProfileTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: { profileId: currentProfile?.id },
      },
    });
  };

  const isDeleting = typedDataLoading || signLoading || writeLoading;

  if (!currentProfile) {
    return <NotFoundPage />;
  }

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="space-y-5 p-5">
          <div className="text-lg font-bold text-red-500">
            This will deactivate your account
          </div>
          <p>
            Deleting your account is permanent. All your data will be wiped out
            immediately and you won&rsquo;t be able to get it back.
          </p>
          <div className="text-lg font-bold">What else you should know</div>
          <div className="text-sm text-gray-500 divide-y dark:divide-gray-700">
            <p className="pb-3">
              You cannot restore your {APP_NAME} account if it was accidentally
              or wrongfully deleted.
            </p>
            <p className="py-3">
              Some account information may still be available in search engines,
              such as Google or Bing.
            </p>
            <p className="py-3">
              Your @handle will be released immediately after deleting the
              account.
            </p>
          </div>
          <Button
            variant="accent"
            icon={
              isDeleting ? (
                <Spinner variant="danger" size="xs" />
              ) : (
                <TrashIcon className="w-5 h-5" />
              )
            }
            disabled={isDeleting}
            onClick={() => setShowWarningModal(true)}
          >
            {isDeleting ? "Deleting..." : "Delete your account"}
          </Button>
          <Modal
            title="Danger Zone"
            icon={<ExclamationIcon className="w-5 h-5 text-red-500" />}
            show={showWarningModal}
            onClose={() => setShowWarningModal(false)}
          >
            <div className="p-5 space-y-3">
              <WarningMessage
                title="Are you sure?"
                message={
                  <div className="leading-6">
                    Confirm that you have read all consequences and want to
                    delete your account anyway
                  </div>
                }
              />
              <Button
                variant="accent"
                icon={<TrashIcon className="w-5 h-5" />}
                onClick={() => {
                  setShowWarningModal(false);
                  handleDelete();
                }}
              >
                Yes, delete my account
              </Button>
            </div>
          </Modal>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default DeleteSettings;
