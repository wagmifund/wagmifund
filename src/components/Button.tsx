import clsx from "clsx";
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
} from "react";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "link";
  icon?: JSX.Element;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const { variant, children, className, icon, ...rest } = props;
    return (
      <button
        className={clsx(
          "btn bg-primary text-white hover:bg-primary border-1",
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
  }
);

export const GradientButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const { children, className, icon, ...rest } = props;
    return (
      <button
        className={clsx(
          "buttons buttons-glow buttons-gradient-border !rounded-md px-[1em] leading-[1em] py-3",
          className
        )}
        ref={ref}
        {...rest}
      >
        {icon}
        {children}
      </button>
    );
  }
);
