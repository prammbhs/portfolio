import { createContext, useContext, useMemo, useState } from "react";
import { cn } from "../../lib/utils";

const TabsContext = createContext(null);

function Tabs({ value: valueProp, defaultValue, onValueChange, className, children }) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;
  const setValue = (next) => {
    if (!isControlled) setUncontrolledValue(next);
    onValueChange?.(next);
  };
  const contextValue = useMemo(() => ({ value, setValue }), [value]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used within Tabs");
  return context;
}

function TabsList({ className, ...props }) {
  return (
    <div
      className={cn("inline-flex flex-wrap gap-2 rounded-md bg-foreground/5 p-1", className)}
      {...props}
    />
  );
}

function TabsTrigger({ value, className, ...props }) {
  const { value: current, setValue } = useTabs();
  const isActive = current === value;
  return (
    <button
      type="button"
      className={cn(
        "rounded-md px-3 py-1.5 text-xs font-semibold transition",
        isActive ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground",
        className
      )}
      onClick={() => setValue(value)}
      {...props}
    />
  );
}

function TabsContent({ value, className, ...props }) {
  const { value: current } = useTabs();
  if (current !== value) return null;
  return <div className={cn("pt-4 text-sm text-foreground/80", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
