import { Card } from "@components/Card";
import { Input } from "@components/Input";
import { Spinner } from "@components/Spinner";
import useOnClickOutside from "@utils/hooks/useOnClickOutside";
import { SearchIcon, XIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import type { Profile } from "generated";
import {
  CustomFiltersTypes,
  SearchRequestTypes,
  useSearchProfilesLazyQuery,
} from "generated";
import { useRouter } from "next/router";
import type { ChangeEvent, FC } from "react";
import { useRef, useState } from "react";

import UserProfile from "../UserProfile";

interface Props {
  hideDropdown?: boolean;
  onProfileSelected?: (profile: Profile) => void;
  placeholder?: string;
  modalWidthClassName?: string;
}

const Search: FC<Props> = ({
  hideDropdown = false,
  onProfileSelected,
  placeholder = "Search...",
  modalWidthClassName = "max-w-md",
}) => {
  const { push, pathname, query } = useRouter();
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setSearchText(""));

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useSearchProfilesLazyQuery();

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
    if (pathname !== "/search" && !hideDropdown) {
      searchUsers({
        variables: {
          request: {
            type: SearchRequestTypes.Profile,
            query: keyword,
            customFilters: [CustomFiltersTypes.Gardeners],
            limit: 8,
          },
        },
      });
    }
  };

  const handleKeyDown = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (pathname === "/search") {
      push(`/search?q=${searchText}&type=${query.type}`);
    } else {
      push(`/search?q=${searchText}&type=profiles`);
    }
    setSearchText("");
  };

  // @ts-ignore
  const profiles = searchUsersData?.search?.items ?? [];

  return (
    <div aria-hidden="true" className="w-full">
      <form onSubmit={handleKeyDown}>
        <Input
          type="text"
          placeholder={placeholder}
          search
          value={searchText}
          iconLeft={<SearchIcon className="w-5 h-5 text-white" />}
          iconRight={
            <XIcon
              className={clsx(
                "cursor-pointer",
                searchText ? "visible" : "invisible"
              )}
              onClick={() => {
                setSearchText("");
              }}
            />
          }
          onChange={handleSearch}
        />
      </form>
      {pathname !== "/search" && !hideDropdown && searchText.length > 0 && (
        <div
          className={clsx(
            "flex absolute flex-col mt-2 w-[94%]",
            modalWidthClassName
          )}
          ref={dropdownRef}
        >
          <Card className="overflow-y-auto py-2 max-h-[80vh] z-[2]">
            {searchUsersLoading ? (
              <div className="py-2 px-4 space-y-2 text-sm font-bold text-center">
                <Spinner size="sm" className="mx-auto" />
                <div>Searching users</div>
              </div>
            ) : (
              <>
                {profiles.map((profile: Profile) => (
                  <div
                    key={profile?.handle}
                    className="py-2 px-4 hover:bg-theme cursor-pointer"
                    onClick={() => {
                      if (onProfileSelected) {
                        onProfileSelected(profile);
                      }
                      setSearchText("");
                    }}
                  >
                    <UserProfile
                      linkToProfile={!onProfileSelected}
                      profile={profile}
                    />
                  </div>
                ))}
                {profiles.length === 0 && (
                  <div className="py-2 px-4">No matching users</div>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Search;
