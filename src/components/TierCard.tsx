import clsx from "clsx";
import { useState } from "react";
import { Card } from "./Card";
import { StarIcon, TrashIcon, XIcon } from "@heroicons/react/outline";
import Button from "@components/Button";
import { useHidePublicationMutation } from "generated";
import { useRouter } from "next/router";
import Modal from "@components/Modal";
import { SUPPORTED_CURRENCIES } from "@utils/constants";
interface TierProps {
  tiers: Array<tier>;
  handle: string;
  activeTier?: number;
  viewOnly?: boolean;
  profile?: any;
  createCollect?: any;
}

export type tier = {
  isLoading?: boolean;
  amount: number;
  comment: string;
  title: string;
  currency: string;
  emoji: string;
  recommendedTier: string;
  id: string;
  setClickedOnContinue?: any;
};

export const StackedTierCard = ({
  activeTier = 0,
  tiers,
  profile,
  handle,
  viewOnly = false,
  createCollect,
}: TierProps) => {
  const [currentTier, setCurrentTier] = useState(activeTier);

  console.log("viewOnly", viewOnly);

  return (
    <Card
      className={clsx(`flex flex-col items-center lg:w-2/5 p-2 sm:p-8`, {
        " text-white bg-gray-900/50 ring-1": viewOnly,
        "border border-theme mx-3": !viewOnly,
      })}
    >
      {!viewOnly ? (
        <h2 className="h-auto font-bold text-xl flex-grow-0 sm:text-2xl text-center">
          {tiers[currentTier]?.title?.length
            ? tiers[currentTier]?.title
            : `Collect tier to support ${handle} in
        ${tiers[currentTier]?.currency}`}
        </h2>
      ) : (
        <h2 className="h-auto font-bold text-xl flex-grow-0 sm:text-2xl text-center">
          {tiers[currentTier]?.title?.length
            ? tiers[currentTier]?.title
            : `Collect tier to support ${handle} in
         ${
           SUPPORTED_CURRENCIES?.filter(
             ({ address }) => address === tiers[currentTier]?.currency
           )?.[0].symbol
         }`}
        </h2>
      )}

      <p className="h-auto min-h-12 py-2 flex-grow-0">
        {tiers[currentTier]?.comment || "sample comment"}
      </p>
      <Card className="border border-theme w-full flex items-center bg-theme p-4">
        <div className="flex justify-center items-center">
          <div className="text-[50px]">{tiers[currentTier]?.emoji}</div>
          <div className="ml-3 text-theme">
            <XIcon className="w-7 h-7 outline-1 dark:text-white text-theme" />
          </div>
          <div className="flex flex-wrap">
            {tiers.map(({ amount }, _index) => (
              <button
                onClick={() => {
                  !viewOnly && setCurrentTier(_index);
                }}
                className={clsx(
                  _index === currentTier
                    ? "bg-theme-darker text-white"
                    : "border border-theme bg-white text-gray-800",
                  "m-1 sm:m-2 h-10 w-10 rounded-full flex justify-center items-center"
                )}
                key={"tier" + _index}
              >
                <span>{amount}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
      <Button
        className="capitalize w-full button-primary border-theme"
        onClick={() => createCollect(tiers[currentTier]?.id)}
        disabled={viewOnly}
      >
        Gift {tiers[currentTier]?.amount}
      </Button>
    </Card>
  );
};

export const TierCards = ({
  tiers,
  isEditMode,
  onMetaClick,
  createCollect,
}: {
  tiers: Array<tier> | [];
  isEditMode: boolean;
  createCollect: any;
  onMetaClick: () => void;
}) => {
  const [hidePost] = useHidePublicationMutation({
    onCompleted: onMetaClick,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  return (
    <>
      {tiers.map(
        ({
          amount,
          comment,
          currency,
          emoji,
          id,
          recommendedTier = "false",
        }) => (
          <Card
            className="border p-4 border-primary w-full sm:w-[45%] lg:w-[30%] flex flex-col items-center relative"
            key={amount}
          >
            {isEditMode && (
              <div className="absolute -right-4 -top-4 bg-slate-900 h-10 w-10 border border-theme rounded-3xl flex justify-center items-center">
                <TrashIcon
                  className="h-8 w-8 text-red-600 cursor-pointer"
                  onClick={() => setShowDeleteModal(true)}
                />
              </div>
            )}
            <Modal
              title="Delete tier"
              onClose={() => setShowDeleteModal(false)}
              show={isEditMode && showDeleteModal}
            >
              <div className="flex flex-col m-4">
                <div className="mb-1">
                  are you sure you want to delete this tier?
                </div>
                <div className="flex justify-center mt-2">
                  <Button
                    onClick={() => {
                      hidePost({
                        variables: {
                          request: { publicationId: id },
                        },
                      });
                      setShowDeleteModal(false);
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    className="ml-2"
                    onClick={() => {
                      setShowDeleteModal(false);
                    }}
                  >
                    No
                  </Button>
                </div>
              </div>
            </Modal>
            {recommendedTier === "true" && (
              <div className="absolute -right-4 -top-4 bg-slate-900 h-10 w-10 border border-theme rounded-3xl flex justify-center items-center">
                <StarIcon
                  className="h-6 w-6 text-theme"
                  onClick={onMetaClick}
                />
              </div>
            )}
            <div className="bg-theme border border-theme rounded-3xl text-4xl h-12 w-12 flex justify-center items-center">
              {emoji}
            </div>
            <div className="my-4">{comment}</div>
            <div className="my-4 text-lg font-semibold">
              {amount} {currency}
            </div>
            <Button
              className="capitalize w-full button-primary border-theme p-1 min-h-[2] !h-2"
              onClick={() => {
                createCollect(id);
              }}
              disabled={isEditMode}
            >
              Gift
            </Button>
          </Card>
        )
      )}
    </>
  );
};
