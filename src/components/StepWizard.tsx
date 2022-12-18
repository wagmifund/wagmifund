import { FC } from "react";
import AppearAnimation from "./AnimatedAppear";

const StepWizard = ({
  stages,
  activeIndex,
  ...props
}: {
  stages: Array<any>;
  className?: string;
  activeIndex: number;
}) => {
  return <AppearAnimation {...props}>{stages[activeIndex]}</AppearAnimation>;
};

export default StepWizard;
