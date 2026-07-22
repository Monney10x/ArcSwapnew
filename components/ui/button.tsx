import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:from-cyan-400 hover:to-cyan-500 [a]:hover:opacity-90',
        outline:
          'border-2 border-cyan-500/50 bg-background/40 backdrop-blur hover:bg-cyan-500/10 hover:text-cyan-300 aria-expanded:bg-cyan-500/20 aria-expanded:text-cyan-300 dark:border-cyan-400/30 dark:bg-input/20 dark:hover:bg-cyan-500/20 shadow-lg shadow-cyan-500/20',
        secondary:
          'bg-gradient-to-r from-violet-600 to-violet-700 text-white font-semibold shadow-lg shadow-violet-500/40 hover:shadow-violet-500/60 hover:from-violet-500 hover:to-violet-600 aria-expanded:opacity-90',
        ghost:
          'text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 aria-expanded:bg-cyan-500/30 aria-expanded:text-cyan-100 dark:hover:bg-cyan-500/15 font-medium',
        destructive:
          'bg-red-600/80 text-white hover:bg-red-500 focus-visible:border-red-400 focus-visible:ring-red-500/30 dark:bg-red-700 dark:hover:bg-red-600 dark:focus-visible:ring-red-500/40 shadow-lg shadow-red-500/30',
        link: 'text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline font-medium',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
