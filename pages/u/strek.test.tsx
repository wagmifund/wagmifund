import AboutSection from "@components/AboutSection";
import { Card } from "@components/Card";
import CoverPicture from "@components/CoverPicture";
import ProfilePicture from "@components/ProfilePicture";
import TierCard from "@components/TierCard";
const ProfilePage = () => {
  return (
    <>
      {/* <div></div>
      <div className="gradient z-0"></div> */}

      <div
        className="w-full z-1 bg-[#0d1933] text-white flex flex-grow px-4 sm:px-8 flex-col"
        data-theme="user"
      >
      <span className="bg-gradient-sides left"></span>
      <span className="bg-gradient-sides right"></span>

        <div className="relative sm:min-h-[300px]">
          <CoverPicture />
          <div className="absolute -bottom-8 left-1/2 -translate-x-[71px] z-10">
            <ProfilePicture />
          </div>
        </div>
        <div className="text-center">
          <div className=" font-space-grotesek font-bold text-4xl mt-10">
            Harish Kumar S S
          </div>
          <div className=" font-space-grotesek font-semibold text-lg mt-2">
            @strek.test
          </div>
          <div className="font-space-grotesek font-medium mt-3">
            Frontend Engineer @CRED, Maintainer at Lenster 🌸 🌿, reactjs.org,
            eslint.org
          </div>
        </div>
        <div className="flex lg:flex-nowrap flex-wrap-reverse w-full md:w-[80%] mt-5 mx-auto">
          <Card className="w-full lg:w-3/5 h-96">
            <AboutSection />
          </Card>
          <TierCard
            tiers={[
              {
                amount: 1,
                comment: "",
                currency: "matic",
                emoji: "💰",
              },
              {
                amount: 2,
                comment: "",
                currency: "usdc",
                emoji: "💰",
              },
              {
                amount: 5,
                comment: "",
                currency: "inr",
                emoji: "💰",
              },
              {
                amount: 2,
                comment: "",
                currency: "usdc",
                emoji: "💰",
              },
              {
                amount: 5,
                comment: "",
                currency: "inr",
                emoji: "💰",
              },
            ]}
            handle={"@strek"}
          />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
