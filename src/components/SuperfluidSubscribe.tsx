import * as React from "react";

import SuperfluidWidget from "../../node_modules/@superfluid-finance/widget";
import superTokenList from "../../node_modules/@superfluid-finance/tokenlist";
import paymentDetails from "@utils/paymentDetails";
import getAvatar from "@utils/getAvatar";
import { Profile } from "generated";

export const SuperfluidSubscribe = ({ profile }: any) => {
  const walletManager = {
    open: async () => {
      console.log("connect");
    },
    isOpen: false,
  };

  const customPaymentDetails = paymentDetails?.paymentOptions?.map(
    (option: any) => {
      return {
        ...option,
        receiverAddress: profile?.ownedBy,
      };
    }
  );

  // const profileDetails = {
  //   name: profile?.handle,
  //   description: profile?.bio,
  //   imageURI: getAvatar(profile as Profile),
  //   successURL: "",
  // };

  return (
    <>
      <SuperfluidWidget
        productDetails={{
          name: profile?.name,
          description: profile?.bio ?? "",
          imageURI: getAvatar(profile as Profile),
          successURL: "",
        }}
        paymentDetails={{
          paymentOptions: customPaymentDetails,
        }}
        tokenList={superTokenList}
        type="dialog"
        walletManager={walletManager}
        stepper={{
          orientation: "horizontal",
        }}
        theme={{
          typography: {
            fontFamily: "'font-space-grotesek', 'sans-serif'",
          },
          palette: {
            mode: "dark",
            primary: {
              main: "#1DB227",
            },
            secondary: {
              main: "#fff",
            },
          },
          shape: {
            borderRadius: 7,
          },
          components: {
            MuiStepIcon: {
              styleOverrides: {
                text: {
                  fill: "#fff",
                },
              },
            },
            MuiOutlinedInput: {
              styleOverrides: {
                root: {
                  borderRadius: 10,
                },
              },
            },
            MuiButton: {
              styleOverrides: {
                root: {
                  borderRadius: 10,
                },
              },
            },
          },
        }}
      >
        {({ openModal }) => (
          <div
            onClick={() => openModal()}
            className="font-space-grotesek font-semibold pulseButton pulseEffect ml-2 mt-1 cursor-pointer"
          >
            Subscribe
          </div>
        )}
      </SuperfluidWidget>
    </>
  );
};
