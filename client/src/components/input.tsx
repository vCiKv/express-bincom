import * as React from "react"

import { cn } from "./utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { label?: string }>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2" ref={ref}>
        {label && <label htmlFor={props.name} className="text-sm font-mono uppercase opacity-75 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-blue-500 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
