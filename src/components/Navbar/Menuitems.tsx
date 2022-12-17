import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { useAppStore } from "@store/app";

import Login from "@components/Shared/Auth/Login";
import UserMenu from "@components/UserMenu";

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

const MenuItems: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const router = useRouter();
  useEffect(() => {
    // check here for
    console.log(currentProfile);
    // if (currentProfile?.handle) router.push("/onboard");
  }, [currentProfile?.handle]);

  if (!currentProfile) {
    return <Login />;
  }

  return <UserMenu />;
};

export default MenuItems;
