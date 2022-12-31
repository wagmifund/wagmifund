import { Profile } from "generated";
import { ExploreProfiles } from "@utils/exploreProfiles";
import { useQuery } from "@apollo/client";
import PageLoader from "@components/PageLoader";
import Link from "next/link";
import getAvatar from "@utils/getAvatar";
import Search from "@components/Search";
import router from "next/router";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from "react";
import MetaTags from "@components/MetaTags";

const Explore = () => {
  const { data } = useQuery(ExploreProfiles, {
    variables: {
      request: { sortCriteria: "MOST_FOLLOWERS" },
    },
  });

  if (!data || !data?.exploreProfiles?.items?.length) {
    <PageLoader />;
  }
  const onProfileSelected = (profile: Profile) => {
    router.push(`/u/${profile?.handle}`);
  };
  return (
    <>
      <MetaTags title={`Explore • Wagmi Fund`} />
      <div className="max-w-[1200px] m-auto p-[40px] sm:p-[70px]">
        <div className="text-white text-[32px] md:text-[50px] mb-[40px] w-full m-auto text-center">
          <span className="span__underline-short pale">Explore</span>
        </div>
        <div className=" max-w-[540px] relative m-auto pb-[50px] sm:p-10 sm:pb-[100px]">
          <Search onProfileSelected={onProfileSelected} />
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-10">
          {data?.exploreProfiles?.items.map(
            (profile: {
              id: Key | null | undefined;
              handle: any;
              name: any;
              bio:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined;
            }) => (
              <Link
                key={profile.id}
                href={`/u/${profile.handle}`}
                passHref
                className="border rounded-lg p-1.5 flex items-center bg-wagmi-black border-wagmi-gray"
              >
                <div className="card h-[200px] ">
                  <div className="card-header mx-4 -mt-6">
                    <img
                      src={getAvatar(profile)}
                      className="rounded-md w-[75px] h-[75px] mr-2 object-cover border-white bg-white border-4"
                      alt={profile.name ?? profile.handle}
                    />
                  </div>
                  <div className="card-body p-4">
                    <h4 className="font-semibold text-white w-[200px] text-ellipsis	overflow-hidden">
                      {profile.name ?? profile.handle}
                    </h4>
                    <p className="text-white mb-3 break-all line-clamp-3">
                      {profile.bio}
                    </p>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Explore;
