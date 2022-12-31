import { Menu, Transition } from "@headlessui/react";
import { CogIcon } from "@heroicons/react/outline";

import resetAuthData from "@utils/resetAuthData";
import clsx from "clsx";
import { useRouter } from "next/router";
import type { FC } from "react";
import React, { Fragment } from "react";
import { useAppPersistStore, useAppStore } from "src/store/app";
import { useDisconnect } from "wagmi";

import { NextLink } from "@components/Navbar/Menuitems";
import { Profile } from "generated";
import getAvatar from "@utils/getAvatar";

const UserMenu: FC = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const {
    query: { username },
  } = useRouter();
  const { disconnect } = useDisconnect();

  const logout = () => {
    setCurrentProfile(null);
    setProfileId(null);
    resetAuthData();
    disconnect?.();
    !username && router.push("/");
  };

  return (
    <div className="text-right">
      <Menu as="div" className="relative text-left">
        <div>
          <Menu.Button
            as="img"
            src={getAvatar(currentProfile as Profile)}
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
          <Menu.Items className="absolute right-0 mt-2 w-44 z-[11] origin-top-right divide-y divide-gray-100 rounded-md bg-wagmi-black text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item as={NextLink} href={`/u/${currentProfile?.handle}`}>
              {({ active }) => (
                <button
                  className={clsx(
                    active ? "bg-[#222]" : "",
                    "group flex flex-col w-full rounded-md p-2 text-sm"
                  )}
                >
                  <p>Signed in as</p>
                  <p className="font-semibold">{currentProfile?.handle}</p>
                </button>
              )}
            </Menu.Item>
            <div className="border border-t"></div>
            <Menu.Item as={NextLink} href="/settings">
              {({ active }) => (
                <button
                  className={clsx(
                    active ? "bg-[#222]" : "",
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  )}
                >
                  <CogIcon className="w-4 h-4 mr-2" />
                  <div>Settings</div>
                </button>
              )}
            </Menu.Item>

            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={clsx(
                      active ? "bg-[#222]" : "",
                      "group flex w-full items-center rounded-md px-2 py-2 text-sm"
                    )}
                  >
                    Logout
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
