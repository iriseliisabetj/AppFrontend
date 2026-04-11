import type { ProfileBadgeDto } from "../../types/profile";

export function BadgeUnlocked({
  badge,
  onClose,
}: {
  badge: ProfileBadgeDto;
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
          UUS MÄRK AVATUD
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

        <div className="row" style={{ justifyContent: "center", marginTop: 20 }}>
          <button className="btn btn--primary" onClick={onClose}>
            Väga lahe →
          </button>
        </div>
      </div>
    </div>
  );
}