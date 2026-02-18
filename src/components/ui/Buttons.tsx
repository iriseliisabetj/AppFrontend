import React from "react";
import { Link } from "react-router-dom";

type LinkButtonProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export function PrimaryLinkButton({ to, children, className }: LinkButtonProps) {
  return (
    <Link className={`btn btn--primary ${className ?? ""}`} to={to}>
      {children} <span aria-hidden>→</span>
    </Link>
  );
}

export function SecondaryLinkButton({ to, children, className }: LinkButtonProps) {
  return (
    <Link className={`btn btn--ghost ${className ?? ""}`} to={to}>
      {children}
    </Link>
  );
}
