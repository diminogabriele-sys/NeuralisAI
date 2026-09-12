import React from "react";

// Minimalist technical-blueprint style silhouette. Not a literal reproduction of
// either motorcycle — a stylised schematic that reads as "engineering drawing".
export default function BikeBlueprint({ variant = "sport", className = "" }) {
  const stroke = "#B3101F";
  const line = "rgba(229,225,216,0.35)";

  return (
    <svg
      viewBox="0 0 600 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={`grid-${variant}`} width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(229,225,216,0.06)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="600" height="300" fill={`url(#grid-${variant})`} />

      {variant === "sport" ? (
        <g>
          {/* S1000RR-inspired sportbike silhouette: low, aggressive fairing */}
          <path
            d="M70 210 C 90 150, 150 120, 210 118 C 250 116, 270 100, 300 96 C 340 90, 380 96, 410 110 C 440 122, 460 140, 480 160 L 500 205"
            stroke={line}
            strokeWidth="2"
          />
          <path
            d="M210 118 L 260 150 L 340 150 L 380 118"
            stroke={stroke}
            strokeWidth="2"
          />
          <line x1="260" y1="150" x2="260" y2="210" stroke={line} strokeWidth="1.5" />
          <line x1="340" y1="150" x2="360" y2="210" stroke={line} strokeWidth="1.5" />
          <circle cx="150" cy="215" r="48" stroke={line} strokeWidth="2" />
          <circle cx="150" cy="215" r="48" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="440" cy="215" r="48" stroke={line} strokeWidth="2" />
          <circle cx="440" cy="215" r="48" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" />
        </g>
      ) : (
        <g>
          {/* Z900-inspired naked/streetfighter silhouette: upright tank, exposed frame */}
          <path
            d="M80 208 C 110 170, 160 150, 210 148 L 260 108 L 320 108 C 350 108, 370 122, 390 138 C 420 130, 450 138, 470 160 L 500 205"
            stroke={line}
            strokeWidth="2"
          />
          <path d="M260 108 L 300 150 L 250 150 Z" stroke={stroke} strokeWidth="2" />
          <line x1="300" y1="150" x2="330" y2="210" stroke={line} strokeWidth="1.5" />
          <line x1="390" y1="138" x2="370" y2="210" stroke={line} strokeWidth="1.5" />
          <circle cx="160" cy="213" r="48" stroke={line} strokeWidth="2" />
          <circle cx="160" cy="213" r="48" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="440" cy="213" r="48" stroke={line} strokeWidth="2" />
          <circle cx="440" cy="213" r="48" stroke={stroke} strokeWidth="1" strokeDasharray="2 6" />
        </g>
      )}

      <line x1="60" y1="260" x2="510" y2="260" stroke="rgba(229,225,216,0.2)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="60" y1="255" x2="60" y2="265" stroke="rgba(229,225,216,0.3)" strokeWidth="1" />
      <line x1="510" y1="255" x2="510" y2="265" stroke="rgba(229,225,216,0.3)" strokeWidth="1" />
    </svg>
  );
}
