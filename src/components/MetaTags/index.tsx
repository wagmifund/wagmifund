import { DESCRIPTION } from "@utils/constants";

import Head from "next/head";
import type { FC } from "react";

interface Props {
  title?: string;
  description?: string;
}

const MetaTags: FC<Props> = ({
  title = "WAGMI Fund",
  description = DESCRIPTION,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />

      <link rel="preconnect" href="https://media.lenster.xyz" />
      <link rel="dns-prefetch" href="https://media.lenster.xyz" />

      <meta property="og:url" content="https://testnet.wagmi.fund" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/og.jpeg" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />

      <meta property="twitter:card" content="summary" />
      <meta property="twitter:site" content={title} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image:src" content="/og.jpeg" />
      <meta property="twitter:image:width" content="400" />
      <meta property="twitter:image:height" content="400" />
      <meta property="twitter:creator" content="WAGMI Fund" />
    </Head>
  );
};

export default MetaTags;
