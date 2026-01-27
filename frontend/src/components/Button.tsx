import { type ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'text' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  text: 'text-sm text-slate-600 hover:text-emerald-600 transition-colors',
  danger: 'btn-primary bg-rose-600 hover:bg-rose-500',
}

export default function Button({ variant = 'ghost', className = '', ...props }: ButtonProps) {
  return (
    <button className={`${variants[variant]} ${className}`.trim()} {...props} />
  )
}
