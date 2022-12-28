import { Hero } from "@modules/LandingPage/Hero";
import { Footer } from "@modules/LandingPage/Footer";

export default function Home() {
  return (
    <>
      <Hero />

      {/* <div className=" max-w-[540px] relative m-auto pb-[50px] sm:p-10 sm:pb-[100px]">
        <Search onProfileSelected={onProfileSelected} />
      </div> */}

      {/* <Features /> */}
      <Footer />
    </>
  );
}
