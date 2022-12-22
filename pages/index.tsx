import Head from "next/head";
import useWindow from "@utils/hooks/useWindow";
import { Hero } from "@modules/LandingPage/Hero";
import { Features } from "@modules/LandingPage/Features";
import { Footer } from "@modules/LandingPage/Footer";

export default function Home() {
  const { width, height } = useWindow();
  return (
    <>
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
