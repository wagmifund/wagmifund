import type { FC, ReactNode } from "react";

import { Card } from "./Card";

interface EmptyStateProps {
  message: ReactNode;
  icon: ReactNode;
  hideCard?: boolean;
}

export const EmptyState: FC<EmptyStateProps> = ({
  message,
  icon,
  hideCard = false,
}) => {
  return (
    <div className="mt-10 w-[90%] md:w-[80%] flex sm:justify-between mx-auto flex-wrap">
      <Card className={hideCard ? "border-0 !bg-transparent !shadow-none" : ""}>
        <div className="grid justify-items-center space-y-2 p-5">
          <div>{icon}</div>
          <div>{message}</div>
        </div>
      </Card>
    </div>
  );
};
