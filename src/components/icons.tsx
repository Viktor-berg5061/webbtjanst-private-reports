import type { CSSProperties, ReactElement } from "react";

/**
 * Inline SVG icons. Rendered as React components so they accept className and
 * inherit currentColor. Strict CSP-safe — no fetch, no script, no third party.
 */

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: CSSProperties;
  title?: string;
};

function base({ size = 18, className, strokeWidth = 1.7, style, title }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    style,
    role: title ? "img" : "presentation",
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
  };
}

export function IconCheck({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function IconMinus({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function IconArrowRight({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function IconGlobe({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
    </svg>
  );
}

export function IconPhone({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function IconCompass({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <circle cx="12" cy="12" r="9" />
      <polygon points="16 8 13 13 8 16 11 11 16 8" />
    </svg>
  );
}

export function IconTool({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <path d="M14.7 6.3a4 4 0 1 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6z" />
    </svg>
  );
}

export function IconHouse({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <path d="M3 12l9-9 9 9" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

export function IconCalendar({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  );
}

export function IconQuote({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <path d="M6 9c-1.5 1-2 2.5-2 4v3h5v-5H6c0-1 0-2 1-2.5" />
      <path d="M15 9c-1.5 1-2 2.5-2 4v3h5v-5h-3c0-1 0-2 1-2.5" />
    </svg>
  );
}

export function IconLayers({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <polygon points="12 3 22 8 12 13 2 8 12 3" />
      <polyline points="2 14 12 19 22 14" />
    </svg>
  );
}

export function IconShield({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function IconTarget({ size, className, strokeWidth, style, title }: IconProps): ReactElement {
  return (
    <svg {...base({ size, className, strokeWidth, style, title })}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
