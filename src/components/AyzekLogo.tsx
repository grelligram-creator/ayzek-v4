import React from 'react';

interface AyzekLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  glow?: boolean;
  theme?: 'default' | 'crimson';
  variant?: 'boxed' | 'iconOnly';
}

export const AyzekLogo: React.FC<AyzekLogoProps> = ({
  size = 'md',
  className = '',
  glow = true,
  theme = 'crimson',
  variant = 'boxed',
}) => {
  const pixelSize =
    typeof size === 'number'
      ? size
      : size === 'xs'
      ? 24
      : size === 'sm'
      ? 32
      : size === 'md'
      ? 44
      : size === 'lg'
      ? 64
      : 88;

  const isCrimson = theme === 'crimson';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      {glow && (
        <div
          className={`absolute inset-0 rounded-2xl blur-md transform -scale-95 ${
            isCrimson
              ? 'bg-gradient-to-tr from-rose-600/50 via-rose-500/40 to-orange-500/40'
              : 'bg-gradient-to-tr from-cyan-500/40 via-blue-600/30 to-purple-600/40'
          }`}
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-sm"
      >
        <defs>
          {/* Glass squircle background gradient */}
          <linearGradient id={isCrimson ? 'bgGradCrimson' : 'bgGrad'} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isCrimson ? '#20050d' : '#0b2447'} />
            <stop offset="45%" stopColor={isCrimson ? '#120307' : '#07142d'} />
            <stop offset="100%" stopColor={isCrimson ? '#080103' : '#0a0f24'} />
          </linearGradient>

          {/* Border glowing gradient */}
          <linearGradient id={isCrimson ? 'borderGradCrimson' : 'borderGrad'} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isCrimson ? '#ff2a4a' : '#38bdf8'} stopOpacity="0.95" />
            <stop offset="35%" stopColor={isCrimson ? '#ff6036' : '#60a5fa'} stopOpacity="0.85" />
            <stop offset="70%" stopColor={isCrimson ? '#f43f5e' : '#c084fc'} stopOpacity="0.85" />
            <stop offset="100%" stopColor={isCrimson ? '#fb7185' : '#38bdf8'} stopOpacity="0.7" />
          </linearGradient>

          {/* Fluid Ribbon Front Arc */}
          <linearGradient id={isCrimson ? 'ribbonFrontCrimson' : 'ribbonCyan'} x1="10%" y1="90%" x2="50%" y2="20%">
            <stop offset="0%" stopColor={isCrimson ? '#ff123d' : '#06b6d4'} />
            <stop offset="35%" stopColor={isCrimson ? '#ff4d36' : '#38bdf8'} />
            <stop offset="70%" stopColor={isCrimson ? '#ff855f' : '#7dd3fc'} />
            <stop offset="100%" stopColor={isCrimson ? '#ffffff' : '#e0f2fe'} />
          </linearGradient>

          {/* Fluid Ribbon Apex Fold */}
          <linearGradient id={isCrimson ? 'ribbonApexCrimson' : 'ribbonPurple'} x1="45%" y1="15%" x2="90%" y2="85%">
            <stop offset="0%" stopColor={isCrimson ? '#ffffff' : '#ffffff'} stopOpacity="1" />
            <stop offset="25%" stopColor={isCrimson ? '#ffa585' : '#c084fc'} stopOpacity="0.95" />
            <stop offset="60%" stopColor={isCrimson ? '#e11d48' : '#a855f7'} stopOpacity="0.95" />
            <stop offset="100%" stopColor={isCrimson ? '#9f1239' : '#ec4899'} stopOpacity="0.9" />
          </linearGradient>

          {/* Fluid Ribbon Crossbar Loop */}
          <linearGradient id={isCrimson ? 'ribbonLoopCrimson' : 'ribbonLoop'} x1="30%" y1="65%" x2="80%" y2="75%">
            <stop offset="0%" stopColor={isCrimson ? '#be123c' : '#0284c7'} />
            <stop offset="50%" stopColor={isCrimson ? '#ff2547' : '#38bdf8'} />
            <stop offset="100%" stopColor={isCrimson ? '#ffaa6b' : '#22d3ee'} />
          </linearGradient>

          {/* Star Sparkle Gradient */}
          <linearGradient id="starGradCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ffd2cc" />
            <stop offset="100%" stopColor="#ff4d6d" />
          </linearGradient>

          {/* Soft Blur Filter for Ambient Glow */}
          <filter id="softGlowCrimson" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Squircle Container (Rendered when variant === 'boxed') */}
        {variant === 'boxed' && (
          <>
            <rect
              x="8"
              y="8"
              width="184"
              height="184"
              rx="44"
              fill={isCrimson ? 'url(#bgGradCrimson)' : 'url(#bgGrad)'}
              stroke={isCrimson ? 'url(#borderGradCrimson)' : 'url(#borderGrad)'}
              strokeWidth="3.5"
            />
            <rect
              x="14"
              y="14"
              width="172"
              height="172"
              rx="38"
              fill="none"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="1.5"
            />
          </>
        )}

        {/* Ambient Radial Light */}
        <circle
          cx="100"
          cy="95"
          r="55"
          fill={isCrimson ? '#ff2a4a' : '#38bdf8'}
          fillOpacity={isCrimson ? 0.22 : 0.16}
          filter="url(#softGlowCrimson)"
        />
        <circle
          cx="120"
          cy="110"
          r="45"
          fill={isCrimson ? '#f43f5e' : '#a855f7'}
          fillOpacity={isCrimson ? 0.2 : 0.14}
          filter="url(#softGlowCrimson)"
        />

        {/* The 3D Fluid 'A' Ribbon Form */}
        <g filter="url(#softGlowCrimson)">
          {/* Back Right Ribbon / Shadow Tail */}
          <path
            d="M96 46 C115 48 148 85 156 142 C154 156 138 160 126 150 C116 140 124 105 106 72 Z"
            fill={isCrimson ? 'url(#ribbonApexCrimson)' : 'url(#ribbonPurple)'}
            fillOpacity="0.88"
          />

          {/* Lower Cross Loop forming the A's bridge */}
          <path
            d="M66 142 C74 122 100 114 136 144 C120 156 80 158 66 142 Z"
            fill={isCrimson ? 'url(#ribbonLoopCrimson)' : 'url(#ribbonLoop)'}
            fillOpacity="0.95"
          />

          {/* Main Left-to-Apex Ascending Hydrofoil Ribbon */}
          <path
            d="M48 148 C36 126 62 82 92 48 C102 36 112 40 110 52 C94 88 58 136 48 148 Z"
            fill={isCrimson ? 'url(#ribbonFrontCrimson)' : 'url(#ribbonCyan)'}
          />

          {/* Curving Glass Overlay / Translucent fold */}
          <path
            d="M86 52 C108 50 144 88 136 146 C124 140 114 116 98 84 C88 66 84 56 86 52 Z"
            fill={isCrimson ? 'url(#ribbonApexCrimson)' : 'url(#ribbonPurple)'}
            fillOpacity="0.78"
          />

          {/* Front Light Specular Streak */}
          <path
            d="M58 134 C68 108 86 78 98 56 C96 66 80 96 70 126 Z"
            fill="white"
            fillOpacity="0.65"
          />
        </g>

        {/* Radiant 4-Point Star Sparkle in Upper Right */}
        <g transform="translate(144, 46)">
          <path
            d="M0 -18 Q0 0 18 0 Q0 0 0 18 Q0 0 -18 0 Q0 0 0 -18 Z"
            fill="url(#starGradCrimson)"
            filter="url(#softGlowCrimson)"
          />
          <circle cx="0" cy="0" r="3" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};
