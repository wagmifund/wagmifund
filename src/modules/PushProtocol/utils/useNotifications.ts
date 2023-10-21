import { useState, useEffect } from "react";
import * as PushAPI from "@pushprotocol/restapi";
import { FeedsOptionsType } from "@pushprotocol/restapi/src/lib/user";

const fetchNotifications = async ({
  user,
  spam,
  env,
  page,
  limit,
  raw,
}: FeedsOptionsType) => {
  return (await PushAPI.user.getFeeds({
    ...{ user, spam, env, page, limit, raw },
    raw: true,
  })) as PushAPI.ApiNotificationType[];
};

export const useNotifications = ({
  user,
  spam,
  env,
  page,
  limit,
  raw,
}: FeedsOptionsType) => {
  const [data, setData] = useState<PushAPI.ApiNotificationType[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const notifications = await fetchNotifications({
          user,
          spam,
          env,
          page,
          limit,
          raw,
        });
        setData(notifications);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [user, spam, env, page, limit, raw]);

  return { data, error, isLoading };
};
