import clsx from "clsx";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({
  children,
  className,
  maxWidth = "lg",
}: ContainerProps) {
  return (
    <div
      className={clsx(
        "w-full mx-auto px-4 sm:px-4 lg:px-4",
        {
          "max-w-sm": maxWidth === "sm",
          "max-w-2xl": maxWidth === "md",
          "max-w-4xl": maxWidth === "lg",
          "max-w-6xl": maxWidth === "xl",
          "max-w-full": maxWidth === "full",
        },
        className
      )}
    >
      {children}
    </div>
  );
}
