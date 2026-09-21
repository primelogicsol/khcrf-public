import Link from "next/link";
import React from "react";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "outline"
  | "ghost"
  | "link";
export type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to fill the available width. */
  block?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

type NativeButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type LinkButtonProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function buttonClassName({
  variant = "primary",
  size = "md",
  block,
  className,
}: Pick<BaseProps, "variant" | "size" | "block" | "className">): string {
  return cx(
    "ui-btn",
    `ui-btn--${variant}`,
    variant !== "link" && `ui-btn--${size}`,
    block && "ui-btn--block",
    className,
  );
}

function isExternal(href: string): boolean {
  return /^(https?:)?\/\/|^mailto:|^tel:|^#/.test(href);
}

/**
 * Canonical Button primitive for the KHCRF platform.
 *
 * Renders a <button> by default, or a navigating element when `href` is set
 * (internal links use next/link, external/anchor targets use a plain <a>).
 * All visual states are driven by the control tokens in globals.css.
 */
export function Button(props: ButtonProps) {
  const {
    variant,
    size,
    block,
    leftIcon,
    rightIcon,
    className,
    children,
    ...rest
  } = props;

  const classes = buttonClassName({ variant, size, block, className });

  const content = (
    <>
      {leftIcon ? (
        <span className="ui-btn__icon" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      <span>{children}</span>
      {rightIcon ? (
        <span className="ui-btn__icon" aria-hidden="true">
          {rightIcon}
        </span>
      ) : null}
    </>
  );

  if (typeof props.href === "string") {
    const { href, ...anchorRest } =
      rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const resolvedHref = props.href;

    if (isExternal(resolvedHref)) {
      return (
        <a href={resolvedHref} className={classes} {...anchorRest}>
          {content}
        </a>
      );
    }

    return (
      <Link href={resolvedHref} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const { type, ...buttonRest } =
    rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type ?? "button"} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}

export default Button;
