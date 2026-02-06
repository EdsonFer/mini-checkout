import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { FormFieldProps } from './types'

const inputStyles = {
  base: 'h-11 rounded-lg',
  error: 'border-destructive focus-visible:ring-destructive/50',
  valid: 'focus-visible:ring-primary/50',
}

const errorTextStyles = 'text-sm text-destructive flex items-center gap-1'

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')
    const errorId = `${fieldId}-error`

    const inputClassName = cn(
      inputStyles.base,
      error ? inputStyles.error : inputStyles.valid,
      className
    )

    return (
      <div className="space-y-1.5">
        <Label htmlFor={fieldId}>{label}</Label>
        <Input
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={inputClassName}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className={errorTextStyles}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
