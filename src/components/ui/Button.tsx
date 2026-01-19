import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "outlineLight";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2",
        {
          "bg-green-600 text-white hover:bg-green-700": variant === "primary",
          "bg-gray-200 text-gray-900 hover:bg-gray-300": variant === "secondary",
          "border-2 border-white text-white hover:bg-white hover:text-green-600":
            variant === "outline",
          "border-2 border-green-600 text-green-600 hover:bg-green-50":
            variant === "outlineLight",
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-base": size === "md",
          "px-8 py-4 text-lg": size === "lg",
          "w-full": fullWidth,
        },
        className
      )}
      {...props}
    />
  );
}
