import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  variant: {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "hover:bg-gray-100 text-gray-900",
    link: "text-blue-600 underline-offset-4 hover:underline bg-transparent",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  },
}

const getButtonClasses = ({ variant = "default", size = "default", className }) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variantClasses = buttonVariants.variant[variant] || buttonVariants.variant.default
  const sizeClasses = buttonVariants.size[size] || buttonVariants.size.default

  return cn(baseClasses, variantClasses, sizeClasses, className)
}

const Button = React.forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  if (asChild) {
    // asChild durumunda children'ı clone edip className'i ekle
    return React.cloneElement(children, {
      className: getButtonClasses({ variant, size, className }),
      ref,
      ...props,
    })
  }

  return (
    <button className={getButtonClasses({ variant, size, className })} ref={ref} {...props}>
      {children}
    </button>
  )
})

Button.displayName = "Button"

export { Button }
