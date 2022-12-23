import { FC } from "react";
import AppearAnimation from "./AnimatedAppear";
import { Card } from "./Card";

const StepWizard = ({
  stages,
  activeIndex,
  ...props
}: {
  stages: Array<any>;
  className?: string;
  activeIndex: number;
}) => {
  return (
    <AppearAnimation {...props}>
      <Card className="bg-gray-900 m-4 w-auto flex flex-col">
        
        {stages[activeIndex]}
      </Card>
    </AppearAnimation>
  );
};

export default StepWizard;
