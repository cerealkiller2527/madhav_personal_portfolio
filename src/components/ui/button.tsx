import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/core/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          "backdrop-blur-[var(--glass-blur)] bg-[hsl(var(--primary)/0.15)] border border-[hsl(var(--primary)/0.3)] text-white shadow-[var(--glass-shadow)] hover:bg-[hsl(var(--primary)/0.2)] hover:border-[hsl(var(--primary)/0.4)] dark:bg-[hsl(var(--primary)/0.1)] dark:border-[hsl(var(--primary)/0.2)] dark:hover:bg-[hsl(var(--primary)/0.15)] dark:hover:border-[hsl(var(--primary)/0.3)]",
        // Navigation variant for header nav links
        nav: "text-white/70 hover:text-white hover:bg-[hsl(var(--glass-hover-bg))] transition-colors",
        // Icon button with glass background
        "icon-glass":
          "bg-[hsl(var(--glass-bg))] border border-[hsl(var(--glass-border))] backdrop-blur-[var(--glass-blur-sm)] hover:bg-primary hover:border-primary hover:text-white transition-all duration-200",
        // Primary outline variant for emphasis buttons
        "outline-primary":
          "border-2 border-primary text-primary bg-transparent hover:bg-primary/10 hover:text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
