import * as React from 'react'
import { cn } from '@/lib/utils'

interface FloatingFieldProps extends React.ComponentProps<'input'> {
  label: string
  error?: string
  /** Optional element pinned to the right inside the field (e.g. a show/hide toggle). */
  rightSlot?: React.ReactNode
}

/**
 * Outlined input with a Material-style floating label, matching the Figma auth
 * screens (`Log In-1.jpg` / `Sign Up-1.jpg`). The label rests inside the field
 * until it has focus or a value, then notches up onto the border. The label is a
 * real `<label>` (accessible) — not a placeholder masquerading as one.
 */
export const FloatingField = React.forwardRef<
  HTMLInputElement,
  FloatingFieldProps
>(({ label, error, rightSlot, id, className, ...props }, ref) => {
  const generatedId = React.useId()
  const inputId = id ?? generatedId

  return (
    <div className="w-full">
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          // The space placeholder is required so `:placeholder-shown` works as
          // the "is empty" signal that drives the floating label.
          placeholder=" "
          aria-invalid={error ? true : undefined}
          className={cn(
            'peer h-14 w-full rounded-md border border-input bg-background px-3.5 pr-11 text-base text-foreground',
            'transition-colors placeholder:text-transparent',
            'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
            'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:border-destructive aria-[invalid=true]:focus:ring-destructive',
            className,
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-background px-1 text-base text-muted-foreground transition-all',
            'peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary',
            'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs',
            'peer-aria-[invalid=true]:text-destructive',
          )}
        >
          {label}
        </label>
        {rightSlot && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  )
})

FloatingField.displayName = 'FloatingField'
