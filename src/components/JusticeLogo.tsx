import React from 'react';

interface JusticeLogoProps {
  size?: number;
  className?: string;
  showTextRings?: boolean;
}

export const JusticeLogo: React.FC<JusticeLogoProps> = ({
  size = 52,
  className = '',
  showTextRings = true,
}) => {
  // Unique IDs for SVG gradients and text paths so multiple instances don't clash
  const idSuffix = React.useId().replace(/:/g, '');
  const topPathId = `top-arc-${idSuffix}`;
  const bottomPathId = `bottom-arc-${idSuffix}`;
  const goldGradId = `gold-grad-${idSuffix}`;
  const darkGradId = `dark-grad-${idSuffix}`;
  const glowGradId = `glow-grad-${idSuffix}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-md select-none ${className}`}
      aria-label="የእኔ ጠበቃ - My Lawyer Logo"
    >
      <defs>
        {/* Rich metallic gold gradient */}
        <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Deep obsidian midnight background */}
        <linearGradient id={darkGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B132B" />
          <stop offset="50%" stopColor="#020617" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Outer radial glow */}
        <radialGradient id={glowGradId} cx="50%" cy="50%" r="50%">
          <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>

        {/* 
          Top Semicircular Arc Path:
          Clockwise arc across the top half of the circle.
          Centered at (80, 80), radius = 64.
          From (16, 80) over the top to (144, 80).
        */}
        <path
          id={topPathId}
          d="M 18,80 A 62,62 0 0,1 142,80"
          fill="none"
        />

        {/* 
          Bottom Semicircular Arc Path:
          Arc across the bottom half of the circle.
          From (22, 85) curving downward to (138, 85).
          With sweep-flag 0 (counter-clockwise / bow downwards),
          the text baseline rests on the curve facing the center upright!
        */}
        <path
          id={bottomPathId}
          d="M 24,84 A 58,58 0 0,0 136,84"
          fill="none"
        />
      </defs>

      {/* Subtle Ambient Outer Ring / Glow */}
      <circle cx="80" cy="80" r="78" fill={`url(#${glowGradId})`} />

      {/* Outer Golden Border */}
      <circle
        cx="80"
        cy="80"
        r="77"
        stroke={`url(#${goldGradId})`}
        strokeWidth="2.5"
        strokeDasharray="4 2"
        opacity="0.8"
      />

      {/* Main Medallion Body */}
      <circle
        cx="80"
        cy="80"
        r="74"
        fill={`url(#${darkGradId})`}
        stroke={`url(#${goldGradId})`}
        strokeWidth="3"
      />

      {/* Inner Boundary Ring */}
      <circle
        cx="80"
        cy="80"
        r="52"
        fill="#020617"
        stroke={`url(#${goldGradId})`}
        strokeWidth="1.5"
        opacity="0.9"
      />

      {/* Top Semicircle Text: የእኔ ጠበቃ in Amharic */}
      {showTextRings && (
        <>
          <text
            fill="#FDE68A"
            fontSize="14.5"
            fontWeight="800"
            fontFamily="'Noto Sans Ethiopic', 'Nyala', sans-serif"
            letterSpacing="2.5"
          >
            <textPath
              href={`#${topPathId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              የእኔ ጠበቃ
            </textPath>
          </text>

          {/* Separator Stars (ግራና ቀኝ ከዋክብት) */}
          <text
            x="14"
            y="84"
            fill="#F59E0B"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            ★
          </text>
          <text
            x="146"
            y="84"
            fill="#F59E0B"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            ★
          </text>

          {/* Bottom Semicircle Text: MY LAWYER in English */}
          <text
            fill="#FCD34D"
            fontSize="11.5"
            fontWeight="800"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            letterSpacing="3"
          >
            <textPath
              href={`#${bottomPathId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              MY LAWYER
            </textPath>
          </text>
        </>
      )}

      {/* CENTER ICON: SCALES OF JUSTICE (የፍትህ ሚዛን) */}
      <g transform="translate(80, 80) scale(0.92) translate(-80, -80)">
        {/* Subtle Justice Sunburst / Radiance */}
        <circle cx="80" cy="80" r="46" fill="#F59E0B" opacity="0.04" />

        {/* Central Vertical Pillar of Justice */}
        <line
          x1="80"
          y1="49"
          x2="80"
          y2="105"
          stroke={`url(#${goldGradId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Top Decorative Finial / Spearhead of Truth */}
        <circle cx="80" cy="48" r="4" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
        <path d="M 80,41 L 83,46 L 77,46 Z" fill="#FDE68A" />

        {/* Horizontal Balance Beam */}
        <line
          x1="52"
          y1="60"
          x2="108"
          y2="60"
          stroke={`url(#${goldGradId})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Central Pivot Ring */}
        <circle cx="80" cy="60" r="3.5" fill="#020617" stroke="#FDE68A" strokeWidth="2" />

        {/* Left Side: Balance Chains & Pan */}
        {/* Left chain strings */}
        <line x1="53" y1="61" x2="43" y2="82" stroke="#F59E0B" strokeWidth="1.2" opacity="0.85" />
        <line x1="53" y1="61" x2="63" y2="82" stroke="#F59E0B" strokeWidth="1.2" opacity="0.85" />
        {/* Left Weighing Pan (Arc Bowl) */}
        <path
          d="M 40,82 Q 53,94 66,82 Z"
          fill={`url(#${goldGradId})`}
          stroke="#FDE68A"
          strokeWidth="1"
        />

        {/* Right Side: Balance Chains & Pan */}
        {/* Right chain strings */}
        <line x1="107" y1="61" x2="97" y2="82" stroke="#F59E0B" strokeWidth="1.2" opacity="0.85" />
        <line x1="107" y1="61" x2="117" y2="82" stroke="#F59E0B" strokeWidth="1.2" opacity="0.85" />
        {/* Right Weighing Pan (Arc Bowl) */}
        <path
          d="M 94,82 Q 107,94 120,82 Z"
          fill={`url(#${goldGradId})`}
          stroke="#FDE68A"
          strokeWidth="1"
        />

        {/* Pillar Pedestal Base (ጥንካሬን የሚወክል መደገፊያ) */}
        {/* Upper tier */}
        <rect
          x="68"
          y="102"
          width="24"
          height="4"
          rx="1"
          fill={`url(#${goldGradId})`}
        />
        {/* Lower tier */}
        <path
          d="M 62,110 L 98,110 L 95,105 L 65,105 Z"
          fill={`url(#${goldGradId})`}
          stroke="#B45309"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
};
