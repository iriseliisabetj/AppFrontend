type ProgressBarProps = {
  current: number;
  total: number;
  label?: string;
};

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const safeTotal = total > 0 ? total : 1;
  const clampedCurrent = Math.min(Math.max(current, 0), safeTotal);
  const percent = (clampedCurrent / safeTotal) * 100;

  return (
    <div className="progressCard">
      <div className="progressCard__top">
        <span className="progressCard__label">{label ?? "Edenemine"}</span>
        <span className="progressCard__value">
          {clampedCurrent} / {safeTotal}
        </span>
      </div>

      <div className="progressBar">
        <div
          className="progressBar__fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}