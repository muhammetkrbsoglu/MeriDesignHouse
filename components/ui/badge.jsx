import { cn } from "@/lib/utils"

const badgeVariants = {
  default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
  secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
  destructive: "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80",
  outline: "text-slate-950 border-slate-200",
}

function Badge({ className, variant = "default", ...props }) {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
  const variantClasses = badgeVariants[variant] || badgeVariants.default

  return <div className={cn(baseClasses, variantClasses, className)} {...props} />
}

export { Badge, badgeVariants }
