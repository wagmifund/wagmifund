import AppearAnimation from "./AnimatedAppear";
import { Form, useZodForm } from "./Form";
import Select from "./Select";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { object, number, string, array } from "zod";
import StepWizard from "./StepWizard";
import { Card } from "./Card";
import { RELAY_ON, SIGN_WALLET, SUPPORTED_CURRENCIES } from "@utils/constants";
import Input from "./Input";
import Button from "./Button";
import React from "react";
import MockTierCard from "./MockTierCard";
import toast, { LoaderIcon } from "react-hot-toast";
import { useAppStore } from "@store/app";
import trimify from "@utils/trimify";
import uploadToArweave from "@utils/uploadToArweave";
import { useContractWrite, useSignTypedData } from "wagmi";
import { TESTNET_LENSHUB_PROXY } from "@utils/contracts";
import { LensHubProxy } from "@abis/LensHubProxy";
import onError from "@utils/onError";
import useBroadcast from "@utils/useBroadcast";
import { usePublicationStore } from "@store/publication";
import { useCollectModuleStore } from "@store/collect-module";
import router from "next/router";
import { useTransactionPersistStore } from "@store/transaction";
import {
  CreatePublicPostRequest,
  PublicationMainFocus,
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation,
} from "generated";
import getSignature from "@utils/getSignature";
import splitSignature from "@utils/splitSignature";

export type tier = {
  isLoading?: boolean;
  amount: number;
  comment: string;
  currency: string;
  emoji: string;
  setClickedOnContinue?: any;
};

const Tier = ({
  onClick,
  field,
  activeTier,
  index,
  isLoading = false,
  setTiersFields,
  fieldsData,
}: {
  index: number;
  field: tier;
  setTiersFields: Dispatch<
    SetStateAction<
      { amount: number; comment: string; currency: string; emoji: string }[]
    >
  >;
  isLoading?: boolean;
  fieldsData: Array<tier>;
  activeTier: number;
  onClick: (field: tier) => void;
}) => {
  const form = useZodForm({
    schema: object({
      amount: number().lt(100),
      comment: string(),
      currency: string(),
      emoji: string(),
    }),
    defaultValues: field,
  });
  const [comment, amount, currency, emoji] = form.watch([
    "comment",
    "amount",
    "currency",
    "emoji",
  ]);

  const [fields, setFields] = useState(fieldsData);
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    const newTiersData = [
      // Items before the insertion point:
      ...fieldsData.slice(0, activeTier),
      // New item:
      { comment, amount, currency, emoji },
      // Items after the insertion point:
      ...fieldsData.slice(activeTier + 1),
    ];
    setFields(newTiersData);
    setTiersFields(newTiersData);
  }, [comment, amount, currency, emoji]);

  return (
    <div className="flex justify-between w-full">
      <div className="w-1/2">
        <Form
          form={form}
          onSubmit={(formData) => {
            onClick(formData);
          }}
        >
          <AppearAnimation className="flex-grow rounded-2xl w-full">
            <Card className=" bg-gray-900 w-full">
              <div className="form-control w-full max-w-md mx-auto">
                <label className="label">
                  <span className="label-text text-white">Currency</span>
                </label>
                <Select
                  className="text-white"
                  options={SUPPORTED_CURRENCIES.map(
                    ({ name, address, symbol }) => ({
                      name,
                      symbol,
                      currency: address,
                      label: name,
                    })
                  )}
                  onChange={(e: { currency: string }) => {
                    form.setValue("currency", e.currency);
                  }}
                  selected
                  defaultValue={
                    SUPPORTED_CURRENCIES.map(({ name, symbol, address }) => ({
                      name,
                      symbol,
                      currency: address,
                      label: name,
                    }))[0]
                  }
                />
              </div>
              <Input
                type="number"
                label="Amount"
                placeholder="5 MATIC"
                {...form.register(`amount`, {
                  valueAsNumber: true,
                  required: true,
                })}
              />
              <Input
                type="text"
                label="Comment"
                placeholder="Thanks for supporting with 5 MATIC"
                {...form.register(`comment`)}
              />
              <Input
                type="text"
                label="Emoji"
                placeholder="💰"
                {...form.register(`emoji`)}
              />
              <div className="flex">
                <Button
                  disabled={isLoading}
                  type="submit"
                  variant="primary"
                  className="mx-auto mt-3 max-w-xs"
                >
                  {isLoading && <LoaderIcon className="mr-2 h-4 w-4" />} add
                  more new tiers
                </Button>

                {activeTier >= 2 ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      onClick(form.getValues());
                    }}
                    className="mx-auto mt-3 max-w-xs"
                  >
                    {isLoading && <LoaderIcon className="mr-2 h-4 w-4" />}
                    continue to with existing tiers
                  </Button>
                ) : (
                  <React.Fragment />
                )}
              </div>
            </Card>
          </AppearAnimation>
        </Form>
      </div>
      <MockTierCard
        currency={currency}
        activeTier={activeTier}
        tiers={fields}
        handle={currentProfile?.handle}
      />
    </div>
  );
};

const TierForm = () => {
  const [fields, setFields] = useState([
    {
      amount: 1,
      comment: "",
      currency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      emoji: "💰",
    },
    {
      amount: 2,
      comment: "",
      currency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      emoji: "💰",
    },
    {
      amount: 5,
      comment: "",
      currency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      emoji: "💰",
    },
  ]);
  const [activeTier, setActiveTier] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError,
  });

  // App store
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Publication store
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );
  const setPublicationContent = usePublicationStore(
    (state) => state.setPublicationContent
  );

  // Collect module store
  const resetCollectSettings = useCollectModuleStore((state) => state.reset);
  const setPayload = useCollectModuleStore((state) => state.setPayload);

  // Transaction persist store
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);

  const [clickedOnContinue, setClickedOnContinue] = React.useState(false);
  const onCompleted = () => {
    toast.success("tier created successfully");
    setActiveTier((currentTier) => currentTier + 1);
    setPublicationContent("");
    resetCollectSettings();
    if (clickedOnContinue && activeTier >= 2) {
      router.push(`/u/${currentProfile?.handle}`);
    }
  };

  const generateOptimisticPost = ({
    txHash,
    txId,
  }: {
    txHash?: string;
    txId?: string;
  }) => {
    return {
      // move it to uuid()
      id: Math.random(),
      type: "NEW_POST",
      txHash,
      txId,
      content: publicationContent,
    };
  };

  const {
    error,
    isLoading: writeLoading,
    write,
  } = useContractWrite({
    address: TESTNET_LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: "postWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: ({ hash }) => {
      onCompleted();
      setTxnQueue([generateOptimisticPost({ txHash: hash }), ...txnQueue]);
    },
    onError,
  });

  const { broadcast, loading: broadcastLoading } = useBroadcast({
    onCompleted: (data) => {
      onCompleted();
      setTxnQueue([
        generateOptimisticPost({ txId: data?.broadcast?.txId }),
        ...txnQueue,
      ]);
    },
  });
  const [createPostTypedData, { loading: typedDataLoading }] =
    useCreatePostTypedDataMutation({
      onCompleted: async ({ createPostTypedData }) => {
        try {
          const { id, typedData } = createPostTypedData;
          const {
            profileId,
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleInitData,
            deadline,
          } = typedData.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            profileId,
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleInitData,
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

  const [createPostViaDispatcher, { loading: dispatcherLoading }] =
    useCreatePostViaDispatcherMutation({
      onCompleted: (data) => {
        onCompleted();
        if (data.createPostViaDispatcher.__typename === "RelayerResult") {
          setTxnQueue([
            generateOptimisticPost({
              txId: data.createPostViaDispatcher.txId,
            }),
            ...txnQueue,
          ]);
        }
      },
      onError,
    });

  const createViaDispatcher = async (request: CreatePublicPostRequest) => {
    const { data } = await createPostViaDispatcher({
      variables: { request },
    });
    if (data?.createPostViaDispatcher?.__typename === "RelayError") {
      createPostTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request,
        },
      });
    }
  };
  setPublicationContent(
    `Collect tier to support ${currentProfile?.handle} in cryptster.xyz/u/${currentProfile?.handle}`
  );

  const createPost = async ({
    emoji,
    comment,
    currency,
    amount,
  }: {
    emoji: string;
    comment: string;
    currency: string;
    amount: number;
  }) => {
    const baseFeeData = {
      amount: {
        currency: currency,
        value: amount.toString(),
      },
      recipient: currentProfile?.ownedBy,
      referralFee: parseFloat("0"),
      followerOnly: false,
    };
    setPayload({
      feeCollectModule: { ...baseFeeData },
    });
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    if (publicationContent.length === 0) {
      return toast.error("Post should not be empty!");
    }

    setIsUploading(true);
    const attributes = [
      {
        traitType: "type",
        displayType: "string",
        value: PublicationMainFocus?.TextOnly?.toLowerCase(),
      },
      {
        traitType: "emoji",
        displayType: "string",
        value: emoji,
      },
      {
        traitType: "comment",
        displayType: "string",
        value: comment,
      },
      {
        traitType: "amount",
        displayType: "string",
        value: amount,
      },
      {
        traitType: "currency",
        displayType: "string",
        value: SUPPORTED_CURRENCIES.filter(
          ({ address }) => address === currency
        )?.[0].symbol,
      },
      {
        traitType: "is_cryptster_tier",
        displayType: "string",
        value: activeTier.toString(),
      },
    ];

    const id = await uploadToArweave({
      version: "2.0.0",
      metadata_id: Math.random(),
      description: trimify(publicationContent),
      content: trimify(publicationContent),
      external_url: `https://wagmi.fund/u/${currentProfile?.handle}`,
      image: null,
      imageMimeType: null,
      name: `Post by @${currentProfile?.handle}`,
      tags: [],
      animation_url: null,
      mainContentFocus: PublicationMainFocus?.TextOnly,
      contentWarning: null, // TODO
      attributes,
      media: [],
      locale: "en-Us",
      createdOn: new Date(),
      appId: "wagmifund",
    }).finally(() => setIsUploading(false));

    const request = {
      profileId: currentProfile?.id,
      contentURI: `https://arweave.net/${id}`,
      collectModule: { feeCollectModule: { ...baseFeeData } },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    if (currentProfile?.dispatcher?.canUseRelay) {
      createViaDispatcher(request);
    } else {
      createPostTypedData({
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

  return (
    <StepWizard
      className="w-full"
      stages={fields.map((field, index) => (
        <Tier
          setTiersFields={setFields}
          isLoading={isLoading}
          activeTier={activeTier}
          key={`tier-${index}`}
          index={index}
          fieldsData={fields}
          field={field}
          onClick={createPost}
        />
      ))}
      activeIndex={activeTier}
    />
  );
};

export default TierForm;