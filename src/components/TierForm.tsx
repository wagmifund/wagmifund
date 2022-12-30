import AppearAnimation from "./AnimatedAppear";
import { Menu } from "@headlessui/react";
import { Form, useZodForm } from "./Form";
import Select from "./Select";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { object, number, string, boolean } from "zod";
import StepWizard from "./StepWizard";
import {
  IS_MAINNET,
  RELAY_ON,
  SIGN_WALLET,
  SUPPORTED_CURRENCIES,
  LENSHUB_PROXY,
} from "@utils/constants";
import Input from "./Input";
import { Button } from "./Button";
import toast, { LoaderIcon } from "react-hot-toast";
import { useAppStore } from "@store/app";
import trimify from "@utils/trimify";
import uploadToArweave from "@utils/uploadToArweave";
import { useContractWrite, useSignTypedData } from "wagmi";
import { LensHubProxy } from "@abis/LensHubProxy";
import onError from "@utils/onError";
import useBroadcast from "@utils/useBroadcast";
import { usePublicationStore } from "@store/publication";
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
  title?: string;
  buttonText: string;
  recommendedTier?: boolean;
  setClickedOnContinue?: any;
};
import { StackedTierCard } from "./TierCard";
import EmojiPicker from "emoji-picker-react";

const Tier = ({
  onClick,
  field,
  activeTier,
  isLoading = false,
  setTiersFields,
  fieldsData,
}: {
  index: number;
  field: tier;
  setTiersFields: Dispatch<
    SetStateAction<
      {
        amount: number;
        comment: string;
        title: string;
        recommendedTier: boolean;
        currency: string;
        emoji: string;
        buttonText: string;
      }[]
    >
  >;
  isLoading?: boolean;
  fieldsData: Array<tier>;
  activeTier: number;
  onClick: (field: tier) => void;
}) => {
  const form = useZodForm({
    schema: object({
      amount: number().lt(100).gt(0),
      title: string(),
      comment: string(),
      currency: string(),
      emoji: string(),
      buttonText: string(),
      recommendedTier: boolean(),
    }),
    defaultValues: field,
  });
  const [comment, amount, title, currency, emoji, recommendedTier, buttonText] =
    form.watch([
      "comment",
      "amount",
      "title",
      "currency",
      "emoji",
      "recommendedTier",
      "buttonText",
    ]);

  const [fields, setFields] = useState(fieldsData);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [recommendedTierState, setRecommendedTierState] = useState(false);
  useEffect(() => {
    const newTiersData = [
      // Items before the insertion point:
      ...fieldsData.slice(0, activeTier),
      // New item:
      { comment, amount, currency, emoji, recommendedTier, title, buttonText },
      // Items after the insertion point:
      ...fieldsData.slice(activeTier + 1),
    ];
    setFields(newTiersData);
    setTiersFields(newTiersData);
  }, [comment, amount, currency, emoji, recommendedTier, title, buttonText]);

  return (
    <AppearAnimation className="flex-grow rounded-2xl w-full">
      <div className="flex flex-col flex-wrap md:flex-row justify-between w-full items-center p-10 pt-0">
        <div className="w-full lg:w-1/2">
          <Form
            form={form}
            onSubmit={(formData) => {
              onClick(formData);
            }}
          >
            <div className="form-control w-full max-w-md mx-auto py-8 px-3">
              <Input
                disabled={isLoading}
                type="text"
                label="Title"
                placeholder="Silver sponsor"
                {...form.register(`title`)}
              />
              <div className="flex">
                <Menu>
                  <Menu.Button className="w-fit">
                    <div className="form-control w-full mx-auto">
                      <label className="label">
                        <span className="label-text text-white">Emoji</span>
                      </label>
                      <div className="flex relative text-2xl text-white w-12 h-12 justify-center bg-[#2A303C] rounded-md items-center">
                        {form.getValues("emoji")}
                      </div>
                    </div>
                  </Menu.Button>
                  <Menu.Items>
                    <div className="absolute z-50">
                      <EmojiPicker
                        theme="dark"
                        onEmojiClick={({ emoji }) => {
                          form.setValue("emoji", emoji);
                        }}
                      />
                    </div>
                  </Menu.Items>
                </Menu>
                <div className="form-control w-full max-w-md mx-auto px-3">
                  <Input
                    disabled={isLoading}
                    type="text"
                    label="Button text"
                    placeholder="Gift"
                    {...form.register("buttonText")}
                  />
                </div>
              </div>

              <label className="label">
                <span className="label-text text-white">Currency</span>
              </label>
              <Select
                isDisabled={isLoading}
                className="text-white"
                options={SUPPORTED_CURRENCIES().map(
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
                  SUPPORTED_CURRENCIES().map(({ name, symbol, address }) => ({
                    name,
                    symbol,
                    currency: address,
                    label: name,
                  }))[0]
                }
              />
              <Input
                disabled={isLoading}
                type="number"
                label="Amount"
                placeholder="5"
                min="0"
                step="0.1"
                {...form.register(`amount`, {
                  valueAsNumber: true,
                  required: true,
                })}
              />
              <Input
                disabled={isLoading}
                type="text"
                label="Comment"
                placeholder="Thanks for supporting with 5 MATIC"
                {...form.register(`comment`, {
                  required: true,
                })}
              />
              <div className="flex h-10 mt-4">
                Recommended Tier
                <input
                  disabled={isLoading}
                  type="checkbox"
                  className="toggle toggle-primary ml-2"
                  {...form.register(`recommendedTier`)}
                  checked={recommendedTierState}
                  onChange={() => {
                    setRecommendedTierState(!recommendedTierState);
                  }}
                />
              </div>
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

                {activeTier >= 3 ? (
                  <a
                    href={`/u/${currentProfile?.handle}`}
                    className="px-6 flex items-center h-[48px] mt-3 text-blue-100 no-underline bg-secondary rounded"
                  >
                    continue to profile
                  </a>
                ) : (
                  <React.Fragment />
                )}
              </div>
            </div>
          </Form>
        </div>
        <StackedTierCard
          tiers={fields}
          handle={currentProfile?.handle}
          activeTier={activeTier}
          viewOnly
        />
      </div>
    </AppearAnimation>
  );
};

const TierForm = () => {
  const [fields, setFields] = useState([
    {
      amount: 1,
      title: "",
      comment: "",
      currency: IS_MAINNET
        ? "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
        : "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      emoji: "💰",
      recommendedTier: false,
    },
    {
      amount: 2,
      title: "",
      comment: "",
      currency: IS_MAINNET
        ? "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
        : "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      emoji: "💰",
      recommendedTier: false,
    },
    {
      amount: 5,
      title: "",
      comment: "",
      currency: IS_MAINNET
        ? "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
        : "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      emoji: "💰",
      recommendedTier: false,
    },
    {
      amount: 10,
      title: "",
      comment: "",
      currency: IS_MAINNET
        ? "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
        : "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      emoji: "💰",
      recommendedTier: false,
    },
    {
      amount: 20,
      title: "",
      comment: "",
      currency: IS_MAINNET
        ? "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
        : "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      emoji: "💰",
      recommendedTier: false,
    },
  ]);
  const publications = usePublicationStore((state) => state.publications);
  const [activeTier, setActiveTier] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (publications.length >= 5) {
      router.push(`/u/${currentProfile?.handle}`);
    } else {
      setActiveTier(publications.length);
    }
  }, [publications.length]);

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

  // Transaction persist store
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);

  const onCompleted = () => {
    toast.success("tier created successfully");
    if (activeTier === 4) {
      router.push(`/u/${currentProfile?.handle}`);
    } else {
      setActiveTier((activeTier) => activeTier + 1);
    }
    setPublicationContent("");
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

  const { isLoading: writeLoading, write } = useContractWrite({
    address: LENSHUB_PROXY,
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
    `Collect tier to support ${currentProfile?.handle} in wagmi.fund/u/${currentProfile?.handle}`
  );

  const createPost = async ({
    emoji,
    comment,
    title,
    buttonText,
    currency,
    recommendedTier,
    amount,
  }: {
    emoji: string;
    comment: string;
    title: string;
    currency: string;
    recommendedTier: boolean;
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

    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    if (publicationContent.length === 0) {
      return toast.error("Tier should not be empty!");
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
      { traitType: "buttonText", displayType: "string", value: buttonText },
      {
        traitType: "amount",
        displayType: "string",
        value: amount,
      },
      {
        traitType: "currency",
        displayType: "string",
        value: SUPPORTED_CURRENCIES().filter(
          ({ address }) => address === currency
        )?.[0].symbol,
      },
      {
        traitType: "title",
        displayType: "string",
        value: title,
      },
      {
        traitType: "recommendedTier",
        displayType: "string",
        value: recommendedTier.toString(),
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
      name: `Tier by @${currentProfile?.handle}`,
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
