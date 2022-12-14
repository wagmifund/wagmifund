import AboutSection from "@components/AboutSection";
import { Card } from "@components/Card";
import CoverPicture from "@components/CoverPicture";
import ProfilePicture from "@components/ProfilePicture";

const ProfilePage = () => {
  return (
    <div
      className="w-screen h-screen text-gray-800 flex flex-grow px-4 sm:px-8 flex-col"
      data-theme="dark"
    >
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
        <Card className="w-full h-96 ">
          <AboutSection />
        </Card>
    </div>
  );
};

export default ProfilePage;
