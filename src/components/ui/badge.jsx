import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-0.5 text-xs font-semibold text-foreground/80",
  {
    variants: {
      variant: {
        default: "",
        secondary: "bg-foreground/10 text-foreground",
        outline: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
