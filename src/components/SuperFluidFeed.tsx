// import PublicationsShimmer from "@components/Shared/Shimmer/PublicationsShimmer";
import { CollectionIcon } from "@heroicons/react/outline";
// import { SuperfluidInflowsDocument } from "@lenster/lens";
// import { superfluidClient } from "@lenster/lens/apollo";
// import { Card, EmptyState, ErrorMessage } from "@lenster/ui";
import superfluidClient from "@utils/SuperFluid/superFluidClient";
import formatHandle from "@utils/formatHandle";
// import { t } from "@lingui/macro";
import { Profile, SuperfluidInflowsDocument } from "generated";
import { type FC, useEffect, useState, Fragment } from "react";
import { Card } from "./Card";
import clsx from "clsx";
import { EmptyState } from "./EmptyState";

export interface Sender {
  id: string;
}
export interface UnderlyingToken {
  name: string;
  symbol: string;
}
export interface Token {
  name: string;
  symbol: string;
  decimals: string;
  id: string;
  underlyingToken: UnderlyingToken;
}

export interface Inflow {
  id: string;
  sender: Sender;
  token: Token;
  deposit: string;
  currentFlowRate: string;
  createdAtTimestamp: string;
}

interface SubscribersFeedProps {
  profile?: Profile;
}

export interface Account {
  createdAtTimestamp: string;
  createdAtBlockNumber: string;
  isSuperApp: boolean;
  updatedAtBlockNumber: string;
  updatedAtTimestamp: string;
  inflows: Inflow[];
}
export interface SuplerfluidInflowsDataType {
  account: Account;
}

const SuperFluidFeed: FC<SubscribersFeedProps> = ({ profile }) => {
  const [currentAddress, setCurrentAddress] = useState("");
  const [superfluidInflowsData, setSuperfluidInflowsData] =
    useState<SuplerfluidInflowsDataType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  console.log("profile?.ownedBy", profile?.ownedBy);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } =
        await superfluidClient.query<SuplerfluidInflowsDataType>({
          query: SuperfluidInflowsDocument,
          variables: { id: profile?.ownedBy.toLowerCase() },
        });
      setCurrentAddress(profile?.ownedBy);
      setSuperfluidInflowsData(data);
      setLoading(false);
      setError(error);
    };

    fetchData();
  }, [profile]);

  if (loading) {
    return null;
  }

  if (superfluidInflowsData?.account === null) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">
              @{formatHandle(profile?.handle)}
            </span>
            <span>{"has nothing in their subscribers feed yet!"}</span>
          </div>
        }
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <Fragment />;
  }

  const filteredArray = superfluidInflowsData?.account.inflows
    .filter((inflow) => parseFloat(inflow.currentFlowRate) > 0)
    .sort((a, b) => {
      return parseFloat(b.currentFlowRate) - parseFloat(a.currentFlowRate);
    });
  return (
    <div className="mt-10 w-[90%] md:w-[80%] flex flex-col sm:justify-between mx-auto flex-wrap">
      <div className="font-space-grotesek font-bold text-xl lg:text-4xl my-4 lg:my-10">
        {filteredArray?.length ? "Montly Subscriptions :" : null}
      </div>
      {superfluidInflowsData?.account.inflows ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredArray?.map((inflow) => {
            const imageURL = `https://nft.superfluid.finance/cfa/v1/getsvg?chain_id=137&sender=${inflow.sender.id}&token_address=${inflow.token.id}&token_symbol=${inflow.token.symbol}&start_date=${inflow.createdAtTimestamp}&receiver=${currentAddress}&flowRate=${inflow.currentFlowRate}&token_decimals=${inflow.token.decimals}`;

            return (
              <Card
                className="divide-y-[1px] p-4 dark:divide-gray-700"
                key={"profile-subscribers-card-" + inflow.id}
              >
                <a
                  href={`https://polygonscan.com/address/${inflow.sender.id}`}
                  target="_blank"
                  className="cursor-pointer underline"
                  rel="noopener noreferrer"
                >
                  <img
                    src={imageURL}
                    loading="lazy"
                    className={clsx("min-h-[250px] min-w-[250px]", {
                      "h-0 opacity-0 animate-pulse": !imageURL,
                    })}
                  />
                </a>
              </Card>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default SuperFluidFeed;
