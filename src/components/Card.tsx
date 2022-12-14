import clsx from "clsx";
import { FC, HTMLProps } from "react";
export const Card: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { className, children } = props;
  return (
    <div
      {...props}
      className={clsx(
        "card border-gray-200 border-opacity-800 border shadow- mt-6 m-2 lg:m-0 w-full lg:w-3/5 bg-white bg-opacity-5 h-96",
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
