import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-[rgba(255,255,255,0.35)] bg-[linear-gradient(135deg,#70c7c1_0%,#4ea49f_100%)] text-white shadow-lift hover:brightness-[1.03] active:translate-y-px",
  secondary:
    "border border-line bg-[rgba(255,255,255,0.78)] text-ink hover:bg-white active:translate-y-px",
  ghost: "bg-transparent text-ink hover:bg-white/50"
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-12 rounded-full px-5 text-sm font-semibold",
  lg: "min-h-14 rounded-full px-6 text-[0.98rem] font-semibold"
};

export function Button({
  className,
  variant = "primary",
  size = "lg",
  icon,
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden tracking-[0.01em] transition duration-200 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        <span>{children}</span>
      </span>
    </button>
  );
}
