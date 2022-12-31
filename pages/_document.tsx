import { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from "@vercel/analytics/react";
import MetaTags from "@components/MetaTags";

export default function Document() {
  return (
    <Html>
      <MetaTags title={`Wagmi Fund`} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Analytics />
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
