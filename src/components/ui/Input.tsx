import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-20 w-full rounded-2xl border-4 border-brand-brown bg-white px-6 py-4 text-2xl font-bold text-brand-brown shadow-cute placeholder:text-brand-brown/40 focus:outline-none focus:ring-4 focus:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
