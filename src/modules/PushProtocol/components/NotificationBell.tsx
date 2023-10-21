import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

import { ENV } from "@pushprotocol/uiweb";
import { useNotifications } from "../utils/useNotifications";
import { NotificationFeed } from "./NotificationFeed";
export type NotificationBellProps = {
  env: ENV;
  accountAddress?: string;
};

export function NotificationBell(props: NotificationBellProps) {
  const [read, setRead] = useState(false);

  const { env, accountAddress } = props;
  // const { address } = useAccount();

  let address = `eip155:5:${accountAddress}`;
  const { data: notifications, isLoading: notificationsIsLoading } =
    useNotifications({
      user: address as string,
      env: env,
      spam: false,
    });

  const { data: spamNotifications, isLoading: spamIsLoading } =
    useNotifications({
      user: address as string,
      env: env,
      spam: true,
    });

  const allNotifications = [...(notifications || [])];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="bg-white rounded-md p-1 pl-2"
          onClick={() => setRead(true)}
        >
          <img
            className="w-6 h-6"
            src="https://app.push.org/static/media/PushBlocknativeLogo.04b115a4c0b42bef077b2bc69647b1e0.svg"
            alt=""
          />
          {allNotifications.length > 0 && !read && (
            <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-red-500">
              {allNotifications.length}
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        avoidCollisions={false}
        className="card w-screen max-w-md !px-4 !shadow-lg !shadow-black/40"
        side="bottom"
      >
        <div>
          <NotificationFeed
            notifications={allNotifications}
            notificationsIsLoading={notificationsIsLoading}
            spamNotifications={spamNotifications ?? []}
            spamNotificationsIsLoading={spamIsLoading}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
