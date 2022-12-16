import clsx from "clsx";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { forwardRef, useId } from "react";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "link";
  icon?: JSX.Element;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Input(
  props,
  ref
) {
  const { variant, children, className, icon, ...rest } = props;
  return (
    <button
      className={clsx(
        "btn bg-primary hover:bg-primary border-1",
        variant && `btn-${variant}`,
        className
      )}
      ref={ref}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});

export default Button;
