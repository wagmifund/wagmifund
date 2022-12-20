import { Menu, Transition } from "@headlessui/react";
import { CogIcon, LogoutIcon, UserIcon } from "@heroicons/react/outline";

import resetAuthData from "@utils/resetAuthData";
import clsx from "clsx";
import { APP_VERSION } from "@utils/constants";
import { useRouter } from "next/router";
import type { FC } from "react";
import { Fragment } from "react";
import { useAppPersistStore, useAppStore } from "src/store/app";
import { useDisconnect } from "wagmi";

import { NextLink } from "@components/Navbar/Menuitems";
import { PublicationTypes, useProfileFeedQuery } from "generated";
import { usePublicationStore } from "@store/publication";
import React from "react";

const UserMenu: FC = () => {
  const router = useRouter();
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const { disconnect } = useDisconnect();

  const logout = () => {
    setCurrentProfile(null);
    setProfileId(null);
    resetAuthData();
    disconnect?.();
    router.push("/");
  };

  return (
    <div className="text-right">
      <Menu as="div" className="relative text-left">
        <div>
          <Menu.Button
            as="img"
            src={"https://files.readme.io/a0959e6-lens-logo1.svg"}
            alt={currentProfile?.handle}
            className="inline-flex justify-center w-8 h-8 rounded-full border cursor-pointer"
          />
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-44 z-[1] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item as={NextLink} href={`/u/${currentProfile?.handle}`}>
                {({ active }) => (
                  <button
                    className={clsx(
                      active ? "bg-violet-500 text-white" : "text-gray-900",
                      "group flex w-full items-center rounded-md px-2 py-2 text-sm"
                    )}
                  >
                    {currentProfile?.handle}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item as={NextLink} href="/settings">
                {({ active }) => (
                  <button
                    className={clsx(
                      active ? "bg-violet-500 text-white" : "text-gray-900",
                      "group flex w-full items-center rounded-md px-2 py-2 text-sm"
                    )}
                  >
                    <CogIcon className="w-4 h-4 mr-2" />
                    <div>Settings</div>
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={clsx(
                      active ? "bg-violet-500 text-white" : "text-gray-900",
                      "group flex w-full items-center rounded-md px-2 py-2 text-sm"
                    )}
                  >
                    Disconnect
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default UserMenu;
