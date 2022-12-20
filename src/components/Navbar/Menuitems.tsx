import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { useAppPersistStore, useAppStore } from "@store/app";

import Login from "@components/Shared/Auth/Login";
import UserMenu from "@components/UserMenu";
import { usePublicationStore } from "@store/publication";
import { PublicationTypes, useProfileFeedQuery } from "generated";

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

const MenuItems: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <Login />;
  }

  return <UserMenu />;
};

export default MenuItems;
