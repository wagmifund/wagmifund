import { Menu } from "@headlessui/react";
import { ColorSwatchIcon } from "@heroicons/react/outline";
import { clsx } from "clsx";
import { useState } from "react";
import { CustomPicker, ChromePicker } from "react-color";

export const convertToHSL = ({
  h,
  s,
  l,
}: {
  h: string;
  s: string;
  l: string;
}) => `hsl(${h} ${Number(s) * 100}% ${Number(l) * 100}%)`;

type color = { h: string; s: string; l: string };

const ColorPicker = (props: {
  colors: Array<color>;
  customColor: color;
  onChange: (color: color) => void;
}) => {
  return (
    <div className="relative">
      <div className="flex justify-center items-center flex-wrap">
        {props.colors.map((color) => {
          return (
            <button
              key={color as unknown as string}
              onClick={() => props.onChange(color)}
              className={clsx("h-9 w-9 m-1 rounded-3xl")}
              style={{ backgroundColor: color as unknown as string }}
            >
            </button>
          );
        })}
        <div className="relative m-1 h-9 w-9 flex justify-center items-center border border-primary rounded-3xl">
          <Menu>
            <Menu.Button
              className={clsx("h-6 rounded-3xl w-6")}
              style={{ backgroundColor: convertToHSL(props.customColor) }}
            />
            <Menu.Items>
              <div className="absolute z-10 top-full right-0">
                <ChromePicker
                  color={props.customColor}
                  onChange={(currentColor: any) => props.onChange(currentColor)}
                />
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default CustomPicker(ColorPicker);
