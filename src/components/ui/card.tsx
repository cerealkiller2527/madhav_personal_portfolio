import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/core/utils"

const cardVariants = cva(
  "rounded-lg border text-card-foreground",
  {
    variants: {
      variant: {
        default: "bg-card shadow-sm",
        // Interactive glass card with hover effect
        glass: "glass hover:shadow-xl transition-shadow duration-300",
        // Static glass card without hover effects
        "glass-static": "glass",
        // Subtle glass for less prominent elements
        "glass-subtle": "glass-subtle",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Glow configuration for different intensities
const glowStyles = {
  none: null,
  subtle: "w-48 h-48 bg-primary/10 opacity-20 group-hover:opacity-40",
  default: "w-64 h-64 bg-primary/15 opacity-25 group-hover:opacity-60",
  strong: "w-[32rem] h-[32rem] bg-primary/20 opacity-30 group-hover:opacity-70 group-hover:scale-110",
} as const

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  glow?: keyof typeof glowStyles
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, glow = "none", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }), glow !== "none" && "relative")}
      {...props}
    >
      {glow !== "none" && glowStyles[glow] && (
        <div 
          className={cn(
            "absolute bottom-0 right-0 rounded-full blur-3xl transition-all duration-500 pointer-events-none translate-x-1/3 translate-y-1/3",
            glowStyles[glow]
          )} 
        />
      )}
      {children}
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
