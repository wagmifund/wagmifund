import { Card } from "@components/Card";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
} from "@components/GridLayout";
import { PhotographIcon } from "@heroicons/react/outline";
import { useProfileSettingsQuery } from "generated";
import type { NextPage } from "next";
import { useAppStore } from "src/store/app";

import Sidebar from "@modules/Settings/Sidebar";
import Picture from "@modules/Settings/Picture";
import Profile from "@modules/Settings/Profile";
import PageLoader from "@components/PageLoader";
import { NotFoundPage } from "@modules/Error/NotFoundPage";
import { ServerError } from "@modules/Error/ServerError";
import MetaTags from "@components/MetaTags";

const ProfileSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { data, loading, error } = useProfileSettingsQuery({
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id,
  });

  if (error) {
    return <ServerError />;
  }

  if (loading) {
    return <PageLoader />;
  }

  if (!currentProfile) {
    return <NotFoundPage />;
  }

  const profile = data?.profile;

  return (
    <>
      <MetaTags title={`Profile Settings • Wagmi Fund`} />
      <GridLayout>
        <GridItemFour>
          <Sidebar />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <Profile profile={profile as any} />
          <Card className="bg-wagmi-black border-wagmi-gray space-y-5 p-5">
            <div className="flex items-center space-x-2">
              {<PhotographIcon className="w-5 h-5" />}
              <div className="hidden sm:block">{"Upload avatar"}</div>
            </div>
            <Picture profile={profile as any} />
          </Card>
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ProfileSettings;
