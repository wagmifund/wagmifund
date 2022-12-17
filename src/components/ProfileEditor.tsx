import { useState } from "react";
import ColorPicker from "./ColorPicker";

const ProfileEditor = () => {
  const [currentRadius, setRadius] = useState("0.9");
  const [customColor, setCustomColor] = useState({
    h: "198",
    s: "0.94",
    l: "0.43",
  });
  return (
    <div className="absolute right-0 top-1/2 w-[168px] text-gray-900 p-2 z-10 bg-white">
      <div className="flex flex-col items-center">
        Color Variants
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
            onChange={(changedColor) => {
              const { h, s, l } = changedColor.hsl;
              setCustomColor(changedColor);
              document
                .querySelector('[data-theme="user"]')
                ?.style.setProperty("--p", `${h} ${s * 100}% ${l * 100}%`);
            }}
          />
        </div>
        Border Radius
        <div>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.1"
            value={currentRadius}
            className="range range-xs"
            onChange={(e) => {
              setRadius(e.target.value);
              document
                .querySelector('[data-theme="user"]')
                ?.style.setProperty("--rounded-box", `${e.target.value}rem`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
