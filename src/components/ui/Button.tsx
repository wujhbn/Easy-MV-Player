import { cn } from "@/lib/utils";
import React from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'control';
  size?: 'default' | 'xl';
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', disabled, children, ...props }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center font-bold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue";
    
    // Large touch targets!
    const sizeStyles = {
      default: "h-20 min-w-20 px-6 text-2xl rounded-2xl border-4 shadow-cute",
      xl: "h-24 min-w-24 px-8 text-3xl rounded-3xl border-[6px] shadow-cute",
    };
    
    const variantStyles = {
      primary: "bg-white text-brand-brown border-brand-brown hover:bg-brand-pink-dark active:shadow-cute-active active:translate-x-1 active:translate-y-1",
      secondary: "bg-brand-yellow text-brand-brown border-brand-brown hover:bg-yellow-400 active:shadow-cute-active active:translate-x-1 active:translate-y-1",
      danger: "bg-red-400 text-white border-brand-brown hover:bg-red-500 active:shadow-cute-active active:translate-x-1 active:translate-y-1",
      ghost: "bg-transparent text-brand-brown border-transparent hover:bg-brand-pink-dark/50 shadow-none hover:shadow-cute active:shadow-cute-active active:translate-x-1 active:translate-y-1",
      control: "bg-brand-green text-brand-brown border-brand-brown hover:bg-green-400 active:shadow-cute-active active:translate-x-1 active:translate-y-1",
    };

    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed transform-none shadow-cute-active translate-x-1 translate-y-1" : "";

    return (
      <motion.button
        ref={ref}
        whileTap={disabled ? {} : { scale: 0.95 }}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], disabledStyles, className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
