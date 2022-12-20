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
  const profileId = useAppPersistStore((state) => state.profileId);
  const setPublications = usePublicationStore((state) => state.setPublications);

  const publicationTypes = [PublicationTypes.Post, PublicationTypes.Mirror];
  const metadata = null;
  const request = {
    publicationTypes,
    metadata,
    profileId: currentProfile?.id,
    limit: 10,
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  // const profileId = currentProfile?.id ?? null;
  console.log("publications", profileId);

  const { data } = useProfileFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: false,
  });
  const Tierattributes = data?.publications.items;

  const filterTierItems = Tierattributes?.filter(
    (tier) => tier.appId === "wagmifund"
  );
  setPublications(filterTierItems);
  console.log("publications", profileId);

  if (!currentProfile) {
    return <Login />;
  }

  return <UserMenu />;
};

export default MenuItems;
