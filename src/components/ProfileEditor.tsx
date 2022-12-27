import {
  ChartSquareBarIcon,
  ChevronRightIcon,
  CogIcon,
} from "@heroicons/react/outline";
import { StackedTierCardIcon } from "@icons/tiers";
import { ProfileUIState, useProfileUIStore } from "@store/profile";
import { useState } from "react";
import ReactDOM from "react-dom";
import AppearAnimation from "./AnimatedAppear";
import Button from "./Button";
import ColorPicker, { convertToHSL } from "./ColorPicker";

const ProfileEditor = () => {
  const setProfileUIData = useProfileUIStore((state) => state.setProfileUIData);
  const gradient = useProfileUIStore((state) => state.profileUIData.gradient);
  const customColor = useProfileUIStore(
    (state) => state.profileUIData.theme
  ) ?? {
    h: "198",
    s: "0.94",
    l: "0.43",
  };
  const currentRadius = useProfileUIStore(
    (state) => state.profileUIData.corners
  );

  const showUISettings = useProfileUIStore((state) => state.showUISettings);
  const setUISettings = useProfileUIStore((state) => state.setUISettings);
  // const [currentRadius, setRadius] = useState("0.9");
  // const [customColor, setCustomColor] = useState({
  //   h: "198",
  //   s: "0.94",
  //   l: "0.43",
  // });
  return showUISettings ? (
    <div>
      <AppearAnimation className="fixed right-0 top-1/4 w-[168px] p-2 z-10 bg-slate-900 ring-1 rounded-2xl text-white transition-150 mr-1">
        <Button
          className="text-primary flex justify-evenly bg-transparent border-transparent lowercase hover:bg-transparent mx-auto"
          onClick={() => {
            setUISettings(false);
          }}
        >
          <p className="text-white">minimize</p>
          <div className="h-6 w-6">
            <ChevronRightIcon />
          </div>
        </Button>
        <div className="flex flex-col items-center">
          Accent color
          <div className="flex flex-wrap">
            <ColorPicker
              colors={[
                "hsl(189 94% 43%)",
                "hsl(330 81% 60%)",
                "hsl(258 90% 66%)",
                "hsl(341 81% 54%)",
                "hsl(290 43% 53%)",
                "hsl(212 92% 56%)",
                "hsl(38 100% 59%)",
                "hsl(159 94% 43%)",
              ]}
              customColor={customColor}
              onChange={(changedColor: { hsl: { h: any; s: any; l: any } }) => {
                const { h, s, l } = changedColor.hsl;

                setProfileUIData({ theme: changedColor.hsl });
                document
                  .querySelector('[data-theme="user"]')
                  ?.style.setProperty("--p", `${h} ${s * 100}% ${l * 100}%`);
              }}
            />
          </div>
          Curvedness
          <div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.1"
              value={currentRadius}
              className="range range-xs"
              onChange={(e) => {
                setProfileUIData({ corners: e.target.value });
                document
                  .querySelector('[data-theme="user"]')
                  ?.style.setProperty("--rounded-box", `${e.target.value}rem`);
              }}
            />
          </div>
          <p className="mt-2">Tiers view</p>
          <div className="flex justify-between">
            <Button
              onClick={() =>
                setProfileUIData({
                  cardView: "stack",
                })
              }
            >
              Stack
            </Button>
            <Button
              onClick={() =>
                setProfileUIData({
                  cardView: "card",
                })
              }
            >
              Card
            </Button>
          </div>
          <div className="flex justify-center h-10 mt-4">
            Gradient
            <input
              type="checkbox"
              className="toggle ml-2 bg-primary"
              checked={gradient === "true"}
              onChange={() => {
                setProfileUIData({
                  gradient: `${gradient === "true" ? "false" : "true"}`,
                });
              }}
            />
          </div>
        </div>
      </AppearAnimation>
    </div>
  ) : (
    <Button
      className="fixed right-0 top-1/2 bg-slate-900 ring-1 h-12 w-12 p-2 rounded-l-2xl"
      onClick={() => setUISettings(true)}
    >
      <CogIcon />
    </Button>
  );
};

export default ProfileEditor;
