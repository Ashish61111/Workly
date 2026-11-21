import "./WorklyWordMark.css";

export default function WorklyWordMark({
                                           prefix = "",
                                           className = "",
                                       }) {
    const isHomeWordmark = className
        .split(/\s+/)
        .includes("home-wordmark");

    const starSize = isHomeWordmark ? "16px" : "12px";

    return (
        <h1 className={`workly-wordmark ${className}`.trim()}>
            {prefix ? `${prefix} ` : ""}

            <span className="workly-wordmark-name">
        WORKLY
        <span
            className="workly-wordmark-star"
            aria-hidden="true"
            style={{
                position: "absolute",
                top: "-0.45em",
                right: "-8px",
                color: "#C8A45D",
                fontFamily: "Arial, sans-serif",
                fontSize: starSize,
                lineHeight: 1,
                pointerEvents: "none",
            }}
        >
          ★
        </span>
      </span>
        </h1>
    );
}
