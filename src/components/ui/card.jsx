import { cn } from "../../lib/utils";

function Card({ className, ...props }) {
  return (
    <div className={cn("rounded-2xl border border-foreground/10 bg-card shadow-sm dark:bg-[#212529]", className)} {...props} />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn("p-5", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <h4 className={cn("text-lg font-semibold text-foreground", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-foreground/70", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center gap-2 px-5 pb-5", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
