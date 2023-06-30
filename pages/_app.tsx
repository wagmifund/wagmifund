import "../styles/globals.scss";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import React, { lazy, Suspense } from "react";
const Providers = lazy(() => import("@utils/Providers"));
const Layout = lazy(() => import("@components/Layout"));
// interface BigInt {
//   /** Convert to BigInt to string form in JSON.stringify */
//   toJSON: () => string;
// }

// The main reason is for Redux to serialize args.
BigInt.prototype.toJSON = function () {
  return this.toString();
};
export default function App({ Component, pageProps }: AppProps) {
  return (
    // add fallback here
    <Suspense>
      <Providers>
        <Layout>
          <script
            defer
            data-domain="wagmi.fund,lensverse.web"
            src="https://plausible.io/js/script.js"
          />
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </Suspense>
  );
}
