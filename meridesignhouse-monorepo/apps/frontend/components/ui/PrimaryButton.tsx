"use client";
import * as React from "react";
import { Button } from "@repo/ui";
import { cn } from "@/lib/utils";

export type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
          className
        )}
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;



