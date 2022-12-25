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
        <div className="m-10 mb-0">
          <div className="alert alert-primary border-theme border shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                <p className="text-md font-semibold">
                  We recommend you to create atleast 3 tiers. You have created{" "}
                  {activeIndex} tiers.
                </p>
                <p>
                  You can later delete and create new tiers and maintain upto 5
                  tiers
                </p>
              </span>
            </div>
          </div>
        </div>
        {stages[activeIndex]}
      </Card>
    </AppearAnimation>
  );
};

export default StepWizard;
