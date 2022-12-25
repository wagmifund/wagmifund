import { Card } from "@components/Card";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
} from "@components/GridLayout";
import { PhotographIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { APP_NAME } from "@utils/constants";
import { useProfileSettingsQuery } from "generated";
import type { NextPage } from "next";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useAppStore } from "src/store/app";

import Sidebar from "@modules/Settings/Sidebar";
import Picture from "@modules/Settings/Picture";
import Profile from "@modules/Settings/Profile";
import PageLoader from "@components/PageLoader";
import { NotFoundPage } from "@modules/Error/NotFoundPage";
import { ServerError } from "@modules/Error/ServerError";

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

  interface TypeButtonProps {
    name: string;
    icon: ReactNode;
    type: "NFT" | "AVATAR";
  }

  const TypeButton: FC<TypeButtonProps> = ({ name, icon }) => (
    <button type="button"></button>
  );

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Profile profile={profile as any} />
        <Card className="space-y-5 p-5">
          <div className="flex items-center space-x-2">
            {<PhotographIcon className="w-5 h-5" />}
            <div className="hidden sm:block">{"Upload avatar"}</div>
          </div>
          <Picture profile={profile as any} />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default ProfileSettings;
