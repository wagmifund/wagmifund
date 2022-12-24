import React, { ReactNode } from "react";
import { forwardRef, useId } from "react";
import { FieldError } from "@components/Form";
import clsx from "clsx";

interface InputProps {
  label: string;
  placeholder: string;
  name: string;
  type?: string;
  search?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref
) {
  const {
    label,
    placeholder,
    type,
    iconLeft,
    iconRight,
    search = false,
    ...rest
  } = props;
  const iconStyles = [
    "text-zinc-500 [&>*]:peer-focus:text-brand-500 [&>*]:h-5",
  ];
  return (
    <div className="form-control w-full mx-auto">
      <label className="label">
        <span className="label-text text-white">{label}</span>
      </label>
      <div
        className={clsx({
          "flex relative mx-auto text-white bg-[#2A303C] rounded-md items-center":
            search,
        })}
      >
        <input
          placeholder={placeholder}
          className="input w-full focus:outline-none"
          ref={ref}
          autoFocus={false}
          {...rest}
          type={type}
        />
        <span
          tabIndex={-1}
          className={clsx({ "order-first pl-3": iconLeft }, iconStyles)}
        >
          {iconLeft}
        </span>
        <span
          tabIndex={-1}
          className={clsx({ "order-last pr-3": iconRight }, iconStyles)}
        >
          {iconRight}
        </span>
        {props.name && <FieldError name={props.name} />}
      </div>
    </div>
  );
});

export default Input;
