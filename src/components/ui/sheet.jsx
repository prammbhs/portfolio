import { cloneElement, createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

const SheetContext = createContext(null);

function Sheet({ open: openProp, onOpenChange, children }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const setOpen = useCallback(
    (value) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setUncontrolledOpen(value);
      }
    },
    [isControlled, onOpenChange]
  );

  const value = useMemo(() => ({ open, setOpen }), [open, setOpen]);
  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

function useSheet() {
  const context = useContext(SheetContext);
  if (!context) throw new Error("Sheet components must be used within Sheet");
  return context;
}

function SheetTrigger({ children, className, asChild = false, ...props }) {
  const { setOpen } = useSheet();
  if (asChild && children && typeof children === "object") {
    return cloneElement(children, {
      ...props,
      onClick: (event) => {
        children.props?.onClick?.(event);
        setOpen(true);
      },
    });
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  );
}

function SheetClose({ children, className, asChild = false, ...props }) {
  const { setOpen } = useSheet();
  if (asChild && children && typeof children === "object") {
    return cloneElement(children, {
      ...props,
      onClick: (event) => {
        children.props?.onClick?.(event);
        setOpen(false);
      },
    });
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  );
}

function SheetContent({ className, side = "right", children }) {
  const { open, setOpen } = useSheet();
  if (!open) return null;

  const content = (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close sheet"
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "absolute h-full w-full max-w-xl bg-background p-6 shadow-xl",
          side === "right" && "right-0 top-0",
          side === "left" && "left-0 top-0",
          className
        )}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

function SheetHeader({ className, ...props }) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

function SheetTitle({ className, ...props }) {
  return <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props} />;
}

function SheetDescription({ className, ...props }) {
  return <p className={cn("text-sm text-foreground/70", className)} {...props} />;
}

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
};
