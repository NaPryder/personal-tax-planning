import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        minimal:
          "border-transparent bg-gradient-to-r from-yellow-400 to-orange-400 text-black [a&]:hover:from-yellow-300 [a&]:hover:to-orange-300",
        warning:
          "border-transparent bg-yellow-400 text-secondary-foreground [a&]:hover:bg-yellow-400 dark:bg-yellow-400 dark:[a&]:hover:bg-yellow-500",

        // Income badge
        employment: "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        professional_fees: "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        goodwill: "border-transparent bg-purple-500 text-white [a&]:hover:bg-purple-600",
        interest_dividend: "border-transparent bg-indigo-500 text-white [a&]:hover:bg-indigo-600",
        rental_property: "border-transparent bg-teal-500 text-white [a&]:hover:bg-teal-600",
        liberal_profession: "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600",
        contracts_advertising: "border-transparent bg-pink-500 text-white [a&]:hover:bg-pink-600",
        other: "border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
export type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
