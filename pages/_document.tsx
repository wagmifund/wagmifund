import { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from "@vercel/analytics/react";
import { APP_NAME, DESCRIPTION } from "@utils/constants";

export default function Document() {
  return (
    <Html>
      <title>wagmifund</title>
      <meta name="title" content="wagmifund" />
      <meta
        name="description"
        content="Decentralized crowd funding platform, built on Lens Protocol 🌿"
      />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://testnet.wagmi.fund/" />
      <meta property="og:title" content="wagmifund" />
      <meta
        property="og:description"
        content="Decentralized crowd funding platform, built on Lens Protocol 🌿"
      />
      <meta property="og:image" content="/og.jpeg" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://testnet.wagmi.fund/" />
      <meta property="twitter:title" content="wagmifund" />
      <meta
        property="twitter:description"
        content="Decentralized crowd funding platform, built on Lens Protocol 🌿"
      />
      <meta property="twitter:image" content="/og.jpeg" />
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
