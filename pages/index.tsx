import Head from "next/head";
import useWindow from "@utils/hooks/useWindow";
import { Hero } from "@modules/LandingPage/Hero";
import { Features } from "@modules/LandingPage/Features";
import { Footer } from "@modules/LandingPage/Footer";
import Search from "@components/Search";
import { Profile } from "generated";
import router from "next/router";

export default function Home() {
  const onProfileSelected = (profile: Profile) => {
    router.push(`/u/${profile?.handle}`);
  };
  const { width, height } = useWindow();
  return (
    <>
      <main>
        <Hero />

        <div className=" max-w-[640px] m-auto p-10">
          <Search onProfileSelected={onProfileSelected} />
        </div>

        <Features />
      </main>
      <Footer />
    </>
  );
}
