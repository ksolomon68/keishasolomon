import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-tight " +
  "transition-[background-color,color,border-color,transform] duration-150 " +
  "active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-y-0";

const variants: Record<Variant, string> = {
  primary: "bg-amber text-navy-950 hover:bg-white border border-amber hover:border-white",
  secondary: "bg-navy-900 text-white hover:bg-navy-700 border border-navy-900 hover:border-navy-700",
  outline: "border border-current bg-transparent hover:bg-navy-900/8",
  ghost: "border border-transparent bg-transparent hover:bg-navy-900/8 underline-offset-4 hover:underline",
  danger: "border border-danger bg-transparent text-danger hover:bg-danger hover:text-white",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-[0.9375rem]",
  sm: "min-h-9 px-3 py-1.5 text-sm",
};

/** Class string shared by <button> and <Link>/<a> so both look identical. */
export function buttonStyles({ variant = "primary", size = "md" }: { variant?: Variant; size?: Size } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant, size, className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`${buttonStyles({ variant, size })} ${className}`} {...props} />;
}
