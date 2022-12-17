import type { ApolloCache } from "@apollo/client";
import { ERRORS } from "@utils/constants";
import { useBroadcastMutation } from "generated";
import toast from "react-hot-toast";

interface Props {
  onCompleted?: (data: any) => void;
  update?: (cache: ApolloCache<any>) => void;
}

const useBroadcast = ({
  onCompleted,
  update,
}: Props): { broadcast: any; data: any; loading: boolean } => {
  const [broadcast, { data, loading }] = useBroadcastMutation({
    onCompleted,
    update,
    onError: (error: any) => {
      if (error.message === ERRORS.notMined) {
        toast.error(error.message);
      }
    },
  });

  return {
    broadcast: ({ request }: any) => broadcast({ variables: { request } }),
    data,
    loading,
  };
};

export default useBroadcast;
