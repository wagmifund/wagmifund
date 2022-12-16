import clsx from "clsx";
import { FC, HTMLProps } from "react";
export const Card: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { className, children } = props;
  return (
    <div
      {...props}
      className={clsx(
        "card border-gray-200 border-opacity-800 border m-2 w-full text-white bg-gray-900/50",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardBody: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { className, children } = props;
  return (
    <div className={clsx("card-body", className)} {...props}>
      {children}
    </div>
  );
};
