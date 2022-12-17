import React from "react";
import { forwardRef, useId } from "react";
import { FieldError } from "@components/Form";

interface InputProps {
  label: string;
  placeholder: string;
  name: string;
  type?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref
) {
  const { label, placeholder, type, ...rest } = props;
  return (
    <div className="form-control w-full mx-auto">
      <label className="label">
        <span className="label-text text-white">{label}</span>
      </label>
      <input
        placeholder={placeholder}
        className="input w-full"
        ref={ref}
        {...rest}
        type={type}
      />
      {props.name && <FieldError name={props.name} />}
    </div>
  );
});

export default Input;
