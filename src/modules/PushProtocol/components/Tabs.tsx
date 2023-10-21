import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import * as TabsPrimivite from "@radix-ui/react-tabs";
import clsx from "clsx";

// import { cn } from "@/lib/utils";

const Tabs = TabsPrimivite.Root;

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimivite.List>,
  ComponentPropsWithoutRef<typeof TabsPrimivite.List>
>(({ className, ...props }, ref) => (
  <TabsPrimivite.List
    ref={ref}
    className={clsx(
      "inline-flex items-center justify-center rounded-md bg-[#262626]  p-1 ",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimivite.List.displayName;

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimivite.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimivite.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimivite.Trigger
    className={clsx(
      "inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3 py-1.5  text-sm font-medium  transition-all  disabled:pointer-events-none disabled:opacity-50  data-[state=active]:text-white data-[state=active]:shadow-sm text-grey data-[state=active]:bg-[#0A0A0A]",
      className
    )}
    {...props}
    ref={ref}
  />
));
TabsTrigger.displayName = TabsPrimivite.Trigger.displayName;

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimivite.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimivite.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimivite.Content
    className={clsx("mt-2 rounded-md border p-6 border-slate-700", className)}
    {...props}
    ref={ref}
  />
));
TabsContent.displayName = TabsPrimivite.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
