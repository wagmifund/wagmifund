import clsx from "clsx";
import { useState } from "react";
import { Card } from "./Card";
import { XIcon } from "@heroicons/react/outline";
import Button from "@components/Button";

interface TierProps {
  tiers: Array<tier>;
  handle: string;
  activeTier?: number;
  viewOnly?: boolean;
  publications?: any;
  profile?: any;
  party?: boolean;
  setParty?: any;
}

export type tier = {
  isLoading?: boolean;
  amount: number;
  comment: string;
  currency: string;
  emoji: string;
  setClickedOnContinue?: any;
};

const TierCard = ({
  handle,
  activeTier = 0,
  tiers,
  publications,
  setParty,
  profile,
  party = false,
  viewOnly = true,
}: TierProps) => {
  const [currentTier, setCurrentTier] = useState(activeTier);

  return (
    <Card
      className={clsx(
        `flex flex-col items-center lg:w-2/5 mx-3 p-2 sm:p-8`,
        {
          " text-white bg-gray-900/50 ring-1": viewOnly,
          "border border-theme": !viewOnly,
        }
      )}
    >
      <h2 className="h-auto font-bold text-xl flex-grow-0 sm:text-2xl text-center">
        Collect tier to support {profile?.handle} in{" "}
        {tiers[currentTier]?.currency}
      </h2>
      <p className="h-auto min-h-12 py-2 flex-grow-0">
        {tiers[currentTier]?.comment || "sample comment"}
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
                onClick={() => {
                  !viewOnly && setCurrentTier(_index);
                }}
                className={clsx(
                  _index === currentTier
                    ? "bg-theme-darker text-primary-content"
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
          onClick={() => {
            console.log(currentTier);
          }}
        >
          Gift {tiers[currentTier]?.amount}
        </Button>
    </Card>
  );
};

export default TierCard;
