import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    size?: "md" | "sm";
    fullWidth?: boolean;
}

export default function Button({
    variant = "primary",
    size = "md",
    fullWidth = false,
    className = "",
    type = "button",
    children,
    ...rest
}: ButtonProps) {
    const classes = [
        "btn",
        `btn--${variant}`,
        size === "sm" ? "btn--sm" : "",
        fullWidth ? "btn--full" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button type={type} className={classes} {...rest}>
            {children}
        </button>
    );
}