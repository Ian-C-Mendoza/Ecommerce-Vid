import React from "react";

interface AnimatedHexagonBgProps {
  style?: React.CSSProperties; // ✅ type added
}

export function AnimatedHexagonBg({ style }: AnimatedHexagonBgProps) {
  const hexagons = [];
  const cols = 15;
  const rows = 10;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * 70 + (row % 2) * 35;
      const y = row * 60;
      const delay = (row + col) * 0.2;
      const shouldRender = Math.random() > 0.3;
      if (shouldRender) {
        const rand = Math.random();
        const sizeVariant =
          rand < 0.2 ? "small" : rand < 0.5 ? "medium" : "large";
        hexagons.push({
          id: `hex-${row}-${col}`,
          x,
          y,
          delay,
          size: sizeVariant,
        });
      }
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden" style={style}>
      <svg
        viewBox="0 0 1100 650"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <path
            id="hexagon-small"
            d="M 15,0 L 7.5,-13 L -7.5,-13 L -15,0 L -7.5,13 L 7.5,13 Z"
          />
          <path
            id="hexagon-medium"
            d="M 20,0 L 10,-17.32 L -10,-17.32 L -20,0 L -10,17.32 L 10,17.32 Z"
          />
          <path
            id="hexagon-large"
            d="M 28,0 L 14,-24.25 L -14,-24.25 L -28,0 L -14,24.25 L 14,24.25 Z"
          />
        </defs>

        {/* Light mode */}
        <g className="dark:hidden">
          {hexagons.map((hex) => (
            <use
              key={`light-${hex.id}`}
              href={`#hexagon-${hex.size}`}
              x={hex.x}
              y={hex.y}
              fill="none"
              stroke="#0891b2"
              strokeWidth={
                hex.size === "small" ? 1 : hex.size === "medium" ? 1.25 : 1.5
              }
              strokeOpacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;0,-20;0,0"
                dur={
                  hex.size === "small"
                    ? "5s"
                    : hex.size === "medium"
                    ? "6s"
                    : "7s"
                }
                begin={`${hex.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.3;0.9;0.3"
                dur={
                  hex.size === "small"
                    ? "5s"
                    : hex.size === "medium"
                    ? "6s"
                    : "7s"
                }
                begin={`${hex.delay}s`}
                repeatCount="indefinite"
              />
            </use>
          ))}
        </g>

        {/* Dark mode */}
        <g className="hidden dark:block">
          {hexagons.map((hex) => (
            <use
              key={`dark-${hex.id}`}
              href={`#hexagon-${hex.size}`}
              x={hex.x}
              y={hex.y}
              fill="none"
              stroke="#84cc16"
              strokeWidth={
                hex.size === "small" ? 1 : hex.size === "medium" ? 1.25 : 1.5
              }
              strokeOpacity="0.7"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;0,-20;0,0"
                dur={
                  hex.size === "small"
                    ? "5s"
                    : hex.size === "medium"
                    ? "6s"
                    : "7s"
                }
                begin={`${hex.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.4;1;0.4"
                dur={
                  hex.size === "small"
                    ? "5s"
                    : hex.size === "medium"
                    ? "6s"
                    : "7s"
                }
                begin={`${hex.delay}s`}
                repeatCount="indefinite"
              />
            </use>
          ))}
        </g>
      </svg>
    </div>
  );
}
