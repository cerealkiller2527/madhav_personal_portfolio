import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/core/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Category variants
        software:
          "bg-[hsl(var(--software)/0.1)] text-[hsl(var(--software))] border-[hsl(var(--software)/0.2)] hover:bg-[hsl(var(--software)/0.2)]",
        hardware:
          "bg-[hsl(var(--hardware)/0.1)] text-[hsl(var(--hardware))] border-[hsl(var(--hardware)/0.2)] hover:bg-[hsl(var(--hardware)/0.2)]",
        hybrid:
          "bg-[hsl(var(--hybrid)/0.1)] text-[hsl(var(--hybrid))] border-[hsl(var(--hybrid)/0.2)] hover:bg-[hsl(var(--hybrid)/0.2)]",
        // Award variants
        "award-gold":
          "bg-[hsl(var(--award-gold)/0.2)] text-[hsl(var(--award-gold-foreground))] dark:text-[hsl(var(--award-gold))] border-[hsl(var(--award-gold)/0.3)] hover:bg-[hsl(var(--award-gold)/0.3)]",
        "award-silver":
          "bg-[hsl(var(--award-silver)/0.2)] text-[hsl(var(--award-silver-foreground))] dark:text-[hsl(var(--award-silver))] border-[hsl(var(--award-silver)/0.3)] hover:bg-[hsl(var(--award-silver)/0.3)]",
        "award-bronze":
          "bg-[hsl(var(--award-bronze)/0.2)] text-[hsl(var(--award-bronze-foreground))] dark:text-[hsl(var(--award-bronze))] border-[hsl(var(--award-bronze)/0.3)] hover:bg-[hsl(var(--award-bronze)/0.3)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// Helper function to get badge variant from category string
function getCategoryBadgeVariant(category: string): BadgeProps["variant"] {
  const categoryMap: Record<string, BadgeProps["variant"]> = {
    "Software": "software",
    "Hardware": "hardware",
    "Hybrid": "hybrid",
  }
  return categoryMap[category] || "default"
}

// Helper function to get badge variant from award rank string
function getAwardBadgeVariant(awardRank: string): BadgeProps["variant"] {
  const lowerRank = awardRank.toLowerCase()
  
  if (lowerRank.includes("1st") || lowerRank.includes("first") || lowerRank.includes("gold")) {
    return "award-gold"
  }
  if (lowerRank.includes("2nd") || lowerRank.includes("second") || lowerRank.includes("silver")) {
    return "award-silver"
  }
  if (lowerRank.includes("3rd") || lowerRank.includes("third") || lowerRank.includes("bronze")) {
    return "award-bronze"
  }
  
  return "default"
}

export { Badge, badgeVariants, getCategoryBadgeVariant, getAwardBadgeVariant }
