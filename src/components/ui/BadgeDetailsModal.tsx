type BadgeDetails = {
  badgeId?: string;
  name: string;
  description: string;
  iconPath: string | null;
  isUnlocked: boolean;
  awardedAt: string | null;
};

export function BadgeDetailsModal({
  badge,
  onClose,
}: {
  badge: BadgeDetails;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        className="card"
        style={{
          width: "min(520px, 100%)",
          textAlign: "center",
          padding: 28,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 900,
            opacity: 0.7,
            letterSpacing: "0.04em",
            marginBottom: 12,
          }}
        >
          {badge.isUnlocked ? "TEENITUD MÄRK" : "LUKUS MÄRK"}
        </div>

        {badge.iconPath && (
          <img
            src={badge.iconPath}
            alt={badge.name}
            style={{
              width: 96,
              height: 96,
              objectFit: "contain",
              marginBottom: 16,
              opacity: badge.isUnlocked ? 1 : 0.45,
            }}
          />
        )}

        <h2 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.5px" }}>
          {badge.name}
        </h2>

        <p
          style={{
            marginTop: 12,
            marginBottom: 0,
            fontSize: 15,
            lineHeight: 1.6,
            opacity: 0.85,
          }}
        >
          {badge.description}
        </p>

        {badge.isUnlocked && badge.awardedAt && (
        <div className="help" style={{ marginTop: 12 }}>
            Teenitud: {new Date(badge.awardedAt).toLocaleString("et-EE")}
        </div>
        )}

        <div className="row" style={{ justifyContent: "center", marginTop: 20 }}>
          <button className="btn btn--primary" onClick={onClose}>
            Sulge
          </button>
        </div>
      </div>
    </div>
  );
}