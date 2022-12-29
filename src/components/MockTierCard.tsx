import { useState } from "react";
import { Button } from "@components/Button";
import clsx from "clsx";
import { XIcon } from "@heroicons/react/outline";
import { Card } from "./Card";

export type tier = {
  isLoading?: boolean;
  amount: number;
  comment: string;
  currency: string;
  emoji: string;
  title?: string;
  setClickedOnContinue?: any;
};

interface TierProps {
  tiers: Array<tier>;
  activeTier?: number;
  viewOnly?: boolean;
  currency: string;
}

const MockTierCard = ({
  activeTier = 0,
  tiers,
  viewOnly = true,
}: TierProps) => {
  const [currentTier, setCurrentTier] = useState(activeTier);

  return (
    <div className="flex flex-col w-2/5">
      <h2 className="mx-auto text-center text-2xl text-white">
        Preview of Tiers 👇🏻
      </h2>
      <Card
        className={clsx(
          `m-2 z-10 py-5 my-auto xl:mt-18 w-full lg:w-full 
        card border-theme  shadow-lg shadow-slate-900/5 ring-slate-900/500 flex flex-col justify-center items-center
        `,
          {
            "bg-slate-900 text-white bg-gray-900/50 ring-1": viewOnly,
            "border border-theme": !viewOnly,
          }
        )}
      >
        <h2 className="h-auto font-bold text-xl flex-grow-0 sm:text-2xl text-center">
          {tiers[currentTier]?.title}
          {/* Collect tier to support {handle} in{" "}
          {
            SUPPORTED_CURRENCIES.filter(
              ({ address }) => tiers[currentTier]?.currency === address
            )?.[0].name
          } */}
        </h2>
        <p className="h-auto min-h-12 py-2 flex-grow-0">
          {tiers[currentTier]?.comment}
        </p>
        <Card className="rounded-md border border-theme w-full flex items-center bg-theme">
          <div className="flex justify-center items-center">
            <div className="text-[50px]">{tiers[currentTier]?.emoji}</div>
            <div className="ml-3 text-theme">
              <XIcon className="w-7 h-7 outline-1 dark:text-white text-theme" />
            </div>
            <div className="flex flex-wrap">
              {tiers.map(({ amount, steps }, _index) => (
                <button
                  key={steps}
                  onClick={() => {
                    !viewOnly && setCurrentTier(_index);
                  }}
                  className={clsx(
                    _index === currentTier
                      ? "bg-theme-darker text-primary-content"
                      : "border border-theme bg-white text-gray-800",
                    "m-1 sm:m-2 h-10 w-10 rounded-full flex justify-center items-center"
                  )}
                >
                  <span>{amount}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
        <div className="card-actions">
          <Button
            className="capitalize w-full button-primary border-theme"
            disabled={true}
          >
            Gift {tiers[currentTier]?.amount}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MockTierCard;
