import "./BrandBadge.css";

function BrandBadge({
                        className = "",
                        size = "72px",
                        label = "Workly",
                    }) {
    return (
        <span
            className={`brand-badge ${className}`.trim()}
            style={{
                width: size,
                height: size,
                fontSize: size,
            }}
            role="img"
            aria-label={label}
        >
      <span
          className="brand-badge-monogram"
          aria-hidden="true"
      >
        WY
      </span>

      <span
          className="brand-badge-star"
          aria-hidden="true"
      >
        ★
      </span>
    </span>
    );
}

export default BrandBadge;