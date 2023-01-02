import { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from "@vercel/analytics/react";
import { APP_NAME, DESCRIPTION } from "@utils/constants";

export default function Document() {
  return (
    <Html>
      <title>{APP_NAME}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />

      <link rel="preconnect" href="https://media.lenster.xyz" />
      <link rel="dns-prefetch" href="https://media.lenster.xyz" />

      <meta property="og:url" content="https://testnet.wagmi.fund" />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:title" content={APP_NAME} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content="/og.jpeg" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />

      <meta property="twitter:card" content="summary" />
      <meta property="twitter:site" content={APP_NAME} />
      <meta property="twitter:title" content={APP_NAME} />
      <meta property="twitter:description" content={DESCRIPTION} />
      <meta property="twitter:image:src" content="/og.jpeg" />
      <meta property="twitter:image:width" content="400" />
      <meta property="twitter:image:height" content="400" />
      <meta property="twitter:creator" content="wagmifund" />
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
