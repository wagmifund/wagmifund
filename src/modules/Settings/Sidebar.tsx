import {
  ExclamationIcon,
  FingerPrintIcon,
  ShareIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { PencilIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";

interface MenuProps {
  children: ReactNode;
  current: boolean;
  url: string;
}

const Menu: FC<MenuProps> = ({ children, current, url }) => (
  <Link
    href={url}
    className={clsx(
      "flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-brand-100 border border-transparent hover:text-brand dark:hover:bg-opacity-20 dark:bg-opacity-20 hover:bg-opacity-100",
      { "bg-wagmi-black border-wagmi-gray border text-brand": current }
    )}
  >
    {children}
  </Link>
);

const Sidebar: FC = () => {
  const { pathname } = useRouter();

  return (
    <div className="px-3 mb-4 space-y-1.5 sm:px-0">
      <Menu current={pathname == "/settings"} url="/settings">
        <UserIcon className="w-4 h-4" />
        <div>Profile</div>
      </Menu>
      <Menu
        current={pathname == "/settings/dispatcher"}
        url="/settings/dispatcher"
      >
        <FingerPrintIcon className="w-4 h-4" />
        <div>Dispatcher</div>
      </Menu>
      <Menu
        current={pathname == "/settings/allowance"}
        url="/settings/allowance"
      >
        <ShareIcon className="w-4 h-4" />
        <div>Allowance</div>
      </Menu>
      <Menu
        current={pathname == "/settings/edit-tiers"}
        url="/settings/edit-tiers"
      >
        <PencilIcon className="w-4 h-4" />
        <div>Edit Tiers</div>
      </Menu>
      <Menu current={pathname == "/settings/danger"} url="/settings/danger">
        <ExclamationIcon className="w-4 h-4 text-red-500" />
        <div className="text-red-500">Danger Zone</div>
      </Menu>
    </div>
  );
};

export default Sidebar;
