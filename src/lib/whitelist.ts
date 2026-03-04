// ── VIP Whitelist ────────────────────────────────────────────────────
// A-class users get the full premium experience for free — all locked
// sections are automatically unlocked, no paywall, no timer pressure.

export type VipTier = "A" | "B";

export interface VipUser {
  slug: string;           // URL-friendly identifier (/vip/richard)
  name: string;           // Display name
  tier: VipTier;          // A = full premium unlock, B = basic unlock
  greeting?: string;      // Optional personalized greeting
}

export const VIP_WHITELIST: VipUser[] = [
  {
    slug: "richard",
    name: "Richard",
    tier: "A",
    greeting: "Welcome back, Richard. Your full blueprint awaits — on us.",
  },
];

export function getVipBySlug(slug: string): VipUser | undefined {
  return VIP_WHITELIST.find((u) => u.slug.toLowerCase() === slug.toLowerCase());
}

export function isVipSession(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ap_vip") === "true";
}

export function getVipName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ap_vip_name");
}

export function getVipTier(): VipTier | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ap_vip_tier") as VipTier | null;
}

export function activateVipSession(user: VipUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("ap_vip", "true");
  localStorage.setItem("ap_vip_name", user.name);
  localStorage.setItem("ap_vip_tier", user.tier);
  localStorage.setItem("ap_vip_slug", user.slug);
}
