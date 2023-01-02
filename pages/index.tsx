import { TwitterPicker } from "react-color";
import { Footer } from "@modules/LandingPage/Footer";
import { useRouter } from "next/router";
import { WrenchIcon } from "@icons/index-page";
import { CurrencyDollarIcon } from "@heroicons/react/outline";
import { GradientButton } from "@components/Button";
import MetaTags from "@components/MetaTags";
import Analytics from "@utils/analytics";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    Analytics.track("homepage landing");
  }, []);
  return (
    <>
      <MetaTags title={`Wagmi Fund`} />
      <section className="hero-section p-8 flex justify-center flex-col items-center h-[100vh]">
        <h1 className="text-white flex items-center justify-center font-extrabold sm:text-[80px] space-x-4 flex-wrap text-[50px]">
          <span> Create. </span>
          <span> Collect. </span>
          <span> Celebrate. </span>
        </h1>
        <h2 className="text-lg text-white mt-4 text-center lg:w-[50vw]">
          Fueling the decentralized future with web3 funding.
        </h2>
        <div className="mt-6 flex space-x-2">
          <GradientButton
            onClick={() => {
              Analytics.track("explore more");
              router.push("/explore");
            }}
          >
            Explore more
          </GradientButton>
        </div>
        <div className="avatar-group -space-x-6 mt-20">
          {[
            "https://media.lenster.xyz/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/bafybeiewog3iscltj6uvus6iut5kerbbkyxovjhvnikrc4luy5sap6w3zu",
            "https://media.lenster.xyz/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/bafybeibh7jl2zrd4hrsbcfqxqj6heuon7dzfj4ckqhu6evm3xyohemnebq",
            "https://media.lenster.xyz/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/QmXobso8qsdDhgZt652EsovW4ZtW5DX9xR57hWpBxEuRTS",
            "https://lens.infura-ipfs.io/ipfs/bafybeiea7ump2inw3hfu5g3uaphb7h3jpgjjp5ruikzxq65vbjkcmv3wka",
            "https://media.lenster.xyz/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/QmVBfhfgfhGsRVxTNURVUgceqyzjdVe11ic5rCghmePuKX",
          ].map((src) => (
            <div className="avatar border-6 border-white" key={src}>
              <div className="w-16 sm:w-20  rounded-full">
                <img src={src} className="rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-index-page flex justify-center min-h-[90vh]">
        <span className="bg-gradient-sides left"></span>
        <span className="bg-gradient-sides right"></span>
        <div className="flex lg:flex-nowrap flex-wrap w-full md:w-[80%] mx-10 lg:space-x-10">
          <div className="my-auto border-gray-200 border-opacity-800 m-2 w-full text-white min-h-[390px] lg:w-3/5 lg:text-left">
            <div className="flex flex-col space-y-8 text-center md:text-left justify-center items-center">
              <div className="w-full">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-700 mb-4 border border-gray-400 mx-auto md:mx-0">
                  <WrenchIcon />
                </div>
                <p className="text-2xl text-white font-semibold my-2">
                  Customizable profile views
                </p>
                <p className="text-gray-400">
                  Build your site just like you imagined the way you want it to
                  be. Customize color, gradients, roundedness and more
                </p>
              </div>
              <div className="w-full">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-700 mb-4 border border-gray-400  mx-auto md:mx-0">
                  <CurrencyDollarIcon className="h-7 w-7" strokeWidth={1} />
                </div>
                <p className="text-2xl text-white font-semibold my-2">
                  Create custom tiers
                </p>
                <p className="text-gray-400">
                  Setting up tiers easier than before. Create tiers to fit your
                  need and customize the appearance of your tiers too.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center">
            <TwitterPicker
              triangle={"hide"}
              onChange={({ hsl: { h, s, l } }) => {
                document
                  .getElementById("dummy-tier")
                  ?.style.setProperty(
                    "--p",
                    `${h} ${Number(s) * 100}% ${Number(l) * 100}%`
                  );
              }}
            />
            <div
              id="dummy-tier"
              className="card xl:w-[60%] w-full mt-6 border-gray-200 border-opacity-800  m-2 text-white bg-gray-900 flex flex-col items-center p-2 sm:p-8 h-fit border border-theme"
            >
              <h2 className="h-auto font-bold text-xl flex-grow-0 sm:text-2xl text-center w-full overflow-hidden text-ellipsis">
                Help wagmi.fund reach its goal
              </h2>
              <p className="h-auto min-h-12 py-2 flex-grow-0">
                Bronze tier: Early adopter get a chance to win a special NFT
              </p>
              <div className="card border-gray-200 border-opacity-800  m-2 text-white bg-gray-900 border border-theme w-full flex items-center bg-theme p-4">
                <div className="flex justify-center items-center">
                  <div className="text-[50px]">💰</div>
                  <div className="ml-3 text-theme">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-7 h-7 outline-1 dark:text-white text-theme"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-wrap">
                    <button className="bg-theme-darker text-white m-1 sm:m-2 h-10 w-10 rounded-full flex justify-center items-center">
                      <span>10</span>
                    </button>
                    <button className="bg-theme-darker text-white m-1 sm:m-2 h-10 w-10 rounded-full flex justify-center items-center">
                      <span>50</span>
                    </button>
                    <button className="bg-theme-darker text-white m-1 sm:m-2 h-10 w-10 rounded-full flex justify-center items-center">
                      <span>100</span>
                    </button>
                  </div>
                </div>
              </div>
              <button className="btn bg-primary text-white hover:bg-primary border-1 capitalize w-full !text-white button-primary border-theme">
                <span className="mr-1"></span>Gift 0.1 MATIC
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div classNameName=" max-w-[540px] relative m-auto pb-[50px] sm:p-10 sm:pb-[100px]">
        <Search onProfileSelected={onProfileSelected} />
      </div> */}

      {/* <Features /> */}
      <Footer />
    </>
  );
}
