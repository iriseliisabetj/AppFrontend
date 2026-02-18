import React from "react";

export function CardHeader({
  title,
  right,
  subtitle,
}: {
  title: string;
  right?: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <h2 className="card__title">{title}</h2>
        {right}
      </div>
      {subtitle ? (
        <div className="help" style={{ marginTop: 8 }}>
          {subtitle}
        </div>
      ) : null}
    </>
  );
}
