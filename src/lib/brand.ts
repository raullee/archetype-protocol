// Brand multi-tenancy: SyncPrimitive (musicians/DJs/producers) vs Saraf (neurodivergent self-knowledge).
// Hostname determines the active config.

export type BrandId = "syncprimitive" | "saraf";

export type BrandConfig = {
  id: BrandId;
  parentBrand: string;
  parentURL: string;
  parentTagline: string;

  accent: string;
  accentSoft: string;
  paper: string;
  paperElevated: string;
  ink: string;
  inkSoft: string;
  muted: string;
  ruleSoft: string;

  displayFont: string;
  bodyFont: string;
  monoFont: string;

  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
  };
  trustStats: Array<{ value: string; label: string }>;
  cta: {
    primary: string;
    secondary: string;
  };
  framework: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  hexacoCrossLink: {
    label: string;
    url: string;
    description: string;
  };
};

export const BRANDS: Record<BrandId, BrandConfig> = {
  syncprimitive: {
    id: "syncprimitive",
    parentBrand: "Sync Primitive",
    parentURL: "https://syncprimitive.com",
    parentTagline: "A SYNC PRIMITIVE LAB",

    accent: "#FF3D00",
    accentSoft: "#FF6A3D",
    paper: "#F0F0F0",
    paperElevated: "#FFFFFF",
    ink: "#121212",
    inkSoft: "#262626",
    muted: "#737373",
    ruleSoft: "rgba(0,0,0,0.08)",

    displayFont: "var(--font-outfit), system-ui, sans-serif",
    bodyFont: "var(--font-outfit), system-ui, sans-serif",
    monoFont: '"JetBrains Mono", "Fira Code", monospace',

    hero: {
      eyebrow: "JUNGIAN ARCHETYPE FRAMEWORK",
      title: "DISCOVER",
      titleAccent: "YOUR ARCHETYPE",
      subtitle: "The psychological framework used by the world's most self-aware people. 90 seconds. Zero fluff.",
    },
    trustStats: [
      { value: "47,000+", label: "ARCHETYPES REVEALED" },
      { value: "4.9/5", label: "BASED ON JUNGIAN PSYCHOLOGY" },
    ],
    cta: {
      primary: "BEGIN DISCOVERY",
      secondary: "EXPLORE ARCHETYPES",
    },
    framework: {
      eyebrow: "THE FRAMEWORK",
      title: "12 UNIVERSAL ARCHETYPES",
      subtitle: "Ancient patterns of personality that shape how you think, lead, love, and create.",
    },
    hexacoCrossLink: {
      label: "HEXACO ASSESSMENT",
      url: "https://hexaco.syncprimitive.com",
      description: "Want to map your six-dimensional personality first?",
    },
  },

  saraf: {
    id: "saraf",
    parentBrand: "Saraf",
    parentURL: "https://saraf.my",
    parentTagline: "A SARAF FRAMEWORK",

    accent: "#D97706",       // amber-600
    accentSoft: "#F59E0B",   // amber-500
    paper: "#FCFAF5",        // warm cream
    paperElevated: "#F4EFE6",
    ink: "#1F1A14",          // warm dark
    inkSoft: "#3D352A",
    muted: "#7A6F60",
    ruleSoft: "rgba(31,26,20,0.14)",

    displayFont: '"Newsreader", "Source Serif Pro", Georgia, serif',
    bodyFont: '"Inter", system-ui, sans-serif',
    monoFont: '"IBM Plex Mono", "JetBrains Mono", monospace',

    hero: {
      eyebrow: "A FRAMEWORK FOR NARRATIVE IDENTITY",
      title: "Twelve archetypes.",
      titleAccent: "Yours among them.",
      subtitle: "Carl Jung's twelve archetypes mapped for self-understanding rather than self-improvement. Built for those who think in patterns, depth, and meaning — and have never quite been described accurately by mainstream personality tools.",
    },
    trustStats: [
      { value: "Twelve", label: "Universal patterns" },
      { value: "8 minutes", label: "Reflective, not rushed" },
    ],
    cta: {
      primary: "Begin",
      secondary: "Read about the framework",
    },
    framework: {
      eyebrow: "The framework",
      title: "Twelve archetypes for self-understanding.",
      subtitle: "Patterns identified across cultures and centuries — adapted here for sustained reflection rather than viral entertainment.",
    },
    hexacoCrossLink: {
      label: "HEXACO framework",
      url: "https://hexaco.saraf.my",
      description: "If you've never been accurately described by a personality test, the HEXACO framework adds the dimension most miss.",
    },
  },
};

export function detectBrand(hostname?: string | null): BrandId {
  const h = (hostname || "").toLowerCase();
  if (h.endsWith(".saraf.my") || h === "saraf.my") return "saraf";
  return "syncprimitive";
}

export function getBrand(hostname?: string | null): BrandConfig {
  return BRANDS[detectBrand(hostname)];
}
