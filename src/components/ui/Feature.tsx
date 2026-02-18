type FeatureProps = { title: string; text: string };

export function Feature({ title, text }: FeatureProps) {
  return (
    <div className="feature">
      <div className="feature__title">{title}</div>
      <div className="feature__text">{text}</div>
    </div>
  );
}
