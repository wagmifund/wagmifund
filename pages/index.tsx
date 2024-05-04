import { TwitterPicker } from "react-color";
import { Footer } from "@modules/LandingPage/Footer";
import { useRouter } from "next/router";
import { WrenchIcon } from "@icons/index-page";
import { CurrencyDollarIcon } from "@heroicons/react/outline";
import { GradientButton } from "@components/Button";
import MetaTags from "@components/MetaTags";
import Analytics from "@utils/analytics";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    Analytics.track("homepage landing");
  }, []);

  const { push } = useRouter();
  return (
    <>
      <MetaTags title={`Wagmi Fund`} />
      <a
        href="https://explorer.gitcoin.co/#/round/42161/25/143"
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center bg-gradient-to-r from-yellow-600 to-red-600 p-2 md:p-3  shadow-md text-center hover:opacity-90 transition-opacity duration-300"
      >
        <h1 className="text-[14px] md:text-[16px] lg:text-[20px] text-white font-bold tracking-wide">
          Support wagmi fund on Gitcoin Grants Round 20
        </h1>
        <svg
          enable-background="new 0 0 141.732 141.732"
          height="20px"
          id="Livello_1"
          version="1.1"
          viewBox="0 0 141.732 141.732"
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1 mt-1 w-[15px] h-[15px] md:w-[20px] md:h-[20px]"
          fill="white"
        >
          <g id="Livello_107">
            <path d="M57.217,63.271L20.853,99.637c-4.612,4.608-7.15,10.738-7.15,17.259c0,6.524,2.541,12.653,7.151,17.261   c4.609,4.608,10.74,7.148,17.259,7.15h0.002c6.52,0,12.648-2.54,17.257-7.15L91.738,97.79c7.484-7.484,9.261-18.854,4.573-28.188   l-7.984,7.985c0.992,4.667-0.443,9.568-3.831,12.957l-37.28,37.277l-0.026-0.023c-2.652,2.316-6.001,3.579-9.527,3.579   c-3.768,0-7.295-1.453-9.937-4.092c-2.681-2.68-4.13-6.259-4.093-10.078c0.036-3.476,1.301-6.773,3.584-9.39l-0.021-0.02   l0.511-0.515c0.067-0.071,0.137-0.144,0.206-0.211c0.021-0.021,0.043-0.044,0.064-0.062l0.123-0.125l36.364-36.366   c2.676-2.673,6.23-4.144,10.008-4.144c0.977,0,1.947,0.101,2.899,0.298l7.993-7.995c-3.36-1.676-7.097-2.554-10.889-2.554   C67.957,56.124,61.827,58.663,57.217,63.271 M127.809,24.337c0-6.52-2.541-12.65-7.15-17.258c-4.61-4.613-10.74-7.151-17.261-7.151   c-6.519,0-12.648,2.539-17.257,7.151L49.774,43.442c-7.479,7.478-9.26,18.84-4.585,28.17l7.646-7.646   c-0.877-4.368,0.358-8.964,3.315-12.356l-0.021-0.022l0.502-0.507c0.064-0.067,0.134-0.138,0.201-0.206   c0.021-0.02,0.04-0.04,0.062-0.06l0.126-0.127l36.363-36.364c2.675-2.675,6.231-4.147,10.014-4.147   c3.784,0,7.339,1.472,10.014,4.147c5.522,5.521,5.522,14.51,0,20.027L76.138,71.629l-0.026-0.026   c-2.656,2.317-5.999,3.581-9.526,3.581c-0.951,0-1.891-0.094-2.814-0.278l-7.645,7.645c3.369,1.681,7.107,2.563,10.907,2.563   c6.523,0,12.652-2.539,17.261-7.148l36.365-36.365C125.27,36.988,127.809,30.859,127.809,24.337" />
          </g>
          <g id="Livello_1_1_" />
        </svg>
      </a>
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
        <div className="avatar-group -space-x-6 p-20">
          {[
            {
              handle: "stani",
              avatar:
                "https://ik.imagekit.io/wagmifund/https://ik.imagekit.io/lens/media-snapshot/e3adfb7046a549480a92c63de2d431f1ced8e516ea285970267c4dc24f941856.png?tr:h-250,tr:w-250",
            },
            {
              handle: "strek",
              avatar:
                "https://ik.imagekit.io/wagmifund/https://ik.imagekit.io/lens/media-snapshot/8785cda39815578df6a4d8d61c4e9943ade87ded82861b62d42233568cbad482.png?tr:h-250,tr:w-250",
            },
            {
              handle: "abhishek",
              avatar:
                "https://ik.imagekit.io/wagmifund/https://ik.imagekit.io/lensterimg/fallback/tr:w-350,h-350,q-80/https://gw.ipfs-lens.dev/ipfs/bafkreibftdca3tfyul52vlfpirtlw4x6swo4v2ovmdyesb45dqrwf32bxm",
            },
            {
              handle: "yoginth",
              avatar:
                "https://ik.imagekit.io/wagmifund/https://ik.imagekit.io/lens/media-snapshot/tr:w-350,h-350,q-80/29e4fa02ae65d97c0ff04a023de02a3a4e4cccd7200b5ea3be0503296ebce0ce.png?tr:h-250,tr:w-250",
            },
            {
              handle: "nader",
              avatar:
                "https://ik.imagekit.io/wagmifund/https://ik.imagekit.io/lens/media-snapshot/61c410bf19ef7e0a1445df3772dd87e876ce29dfdbd122d49b2cff8204b4db14.png?tr:h-250,tr:w-250",
            },
          ].map(({ handle, avatar }) => (
            <Link
              href={`u/${handle}.lens`}
              key={avatar}
              className="avatar border-6 border-white focus:border-6 focus:border-violet-500 focus:outline-none"
            >
              <div className="w-16 sm:w-20  rounded-full">
                <img
                  src={avatar}
                  className="rounded-full"
                  alt={`avatar of ${handle}`}
                />
              </div>
            </Link>
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
              <button
                className="btn bg-primary text-white hover:bg-primary border-1 capitalize w-full !text-white button-primary border-theme"
                onClick={() => push("/u/wagmifund.lens")}
              >
                <span className="mr-1"></span>Sponsor 10 MATIC
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
