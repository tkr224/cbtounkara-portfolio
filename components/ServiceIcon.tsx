import type { ServiceIcon as Kind } from "@/lib/site";

/** Pictogrammes au trait, dans l'esprit des icônes système. */
export function ServiceIcon({ kind, className = "" }: { kind: Kind; className?: string }) {
  const common = {
    width: 32,
    height: 32,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (kind) {
    case "showcase":
      return (
        <svg {...common}>
          <rect x="3.5" y="6" width="25" height="18" rx="3.5" />
          <path d="M3.5 11h25M12 28h8M16 24v4" />
        </svg>
      );
    case "shop":
      return (
        <svg {...common}>
          <path d="M6 10h20l-1.6 14.2a3 3 0 0 1-3 2.8H10.6a3 3 0 0 1-3-2.8L6 10Z" />
          <path d="M11.5 13V9a4.5 4.5 0 0 1 9 0v4" />
        </svg>
      );
    case "app":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="10" height="10" rx="3" />
          <rect x="18" y="4" width="10" height="10" rx="3" />
          <rect x="4" y="18" width="10" height="10" rx="3" />
          <rect x="18" y="18" width="10" height="10" rx="5" />
        </svg>
      );
    case "platform":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="12" />
          <path d="M4 16h24M16 4c3.2 3.3 4.8 7.3 4.8 12S19.2 24.7 16 28c-3.2-3.3-4.8-7.3-4.8-12S12.8 7.3 16 4Z" />
        </svg>
      );
  }
}
