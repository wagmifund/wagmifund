import "../styles/globals.scss";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import React, { lazy, Suspense } from "react";
const Providers = lazy(() => import("@utils/Providers"));
const Layout = lazy(() => import("@components/Layout"));
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Suspense>
      <Providers>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </Suspense>
  );
}
