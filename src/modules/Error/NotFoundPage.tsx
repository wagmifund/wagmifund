import Button from "@components/Button";
import Image from "next/image";

export function NotFoundPage() {
  return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center p-5 w-full">
      <div className="text-center">
        <div className="mb-5">
          <img className="m-auto" src="https://i.ibb.co/ck1SGFJ/Group.png" />
        </div>

        <h1 className="my-2 text-white font-bold text-2xl">
          Looks like you&apos;ve found the doorway to the great nothing
        </h1>
        <p className="my-7 text-white">
          Sorry about that! Please visit our hompage to get where you need to
          go.
        </p>
        <Button>Take me there!</Button>
      </div>
    </div>
  );
}
