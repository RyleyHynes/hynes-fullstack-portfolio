import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'

type IconButtonBaseProps = {
  icon: ReactNode
  ariaLabel: string
}

type IconButtonProps =
  | (IconButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (IconButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })

const IconButton = ({ icon, ariaLabel, href, className = '', ...props }: IconButtonProps) => {
  const classes = `btn-ghost inline-flex items-center justify-center px-2 py-2 ${className}`.trim()

  if (href) {
    return (
      <a className={classes} href={href} aria-label={ariaLabel} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {icon}
      </a>
    )
  }

  return (
    <button className={classes} type="button" aria-label={ariaLabel} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {icon}
    </button>
  )
}

export default IconButton
