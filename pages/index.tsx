import Head from "next/head";
import Confetti from "react-confetti";
import Image from "next/image";
import useWindow from "@utils/hooks/useWindow";

export default function Home() {
  const { width, height } = useWindow();
  return (
    width &&
    height && (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="black"
      >
        <Confetti width={width} height={height} />
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-[10vw] font-bold text-white">Coming Soon 🚀</h1>
          <h4 className="text-[5vw] font-bold text-white">wagmifund 🌿</h4>
        </div>
      </div>
    )
  );
}
