import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-miku-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-miku-primary text-[#0D0D1A] shadow-[0_2px_12px_rgba(168,230,225,0.3)] hover:bg-miku-primary-dark hover:shadow-[0_4px_20px_rgba(168,230,225,0.4)] active:scale-[0.98]",
        secondary:
          "bg-[rgba(168,230,225,0.12)] text-foreground border-[1.5px] border-[rgba(168,230,225,0.35)] hover:bg-[rgba(168,230,225,0.2)] active:scale-[0.98]",
        glass:
          "bg-[rgba(255,255,255,0.1)] backdrop-blur-md text-foreground border border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.15)] hover:-translate-y-0.5 active:scale-[0.98]",
        gradient:
          "bg-gradient-to-r from-miku-primary to-miku-primary-light text-[#0D0D1A] rounded-full shadow-[0_2px_16px_rgba(168,230,225,0.25)] hover:shadow-[0_4px_24px_rgba(168,230,225,0.35)] hover:-translate-y-0.5 active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
