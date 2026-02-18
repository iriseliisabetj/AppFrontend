type StatCardProps = { title: string; value: string; hint: string };

export function StatCard({ title, value, hint }: StatCardProps) {
  return (
    <div className="stat">
      <div className="stat__title">{title}</div>
      <div className="stat__value">{value}</div>
      <div className="stat__hint">{hint}</div>
    </div>
  );
}
