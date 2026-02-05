import { cn } from "../../lib/utils";

function Separator({ className, orientation = "horizontal", ...props }) {
  return (
    <div
      className={cn(
        "bg-foreground/10",
        orientation === "vertical" ? "h-full w-px" : "h-px w-full",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
