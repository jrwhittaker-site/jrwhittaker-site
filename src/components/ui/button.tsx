import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 border shadow-sm px-4 py-2',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:opacity-90 border-transparent',
        outline: 'bg-background hover:bg-muted text-foreground border',
        ghost: 'bg-transparent hover:bg-muted text-foreground border-transparent shadow-none',
        secondary: 'bg-secondary text-secondary-foreground hover:opacity-90'
      },
      size: { default: 'h-10', sm: 'h-9 px-3', lg: 'h-11 px-8' }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'
