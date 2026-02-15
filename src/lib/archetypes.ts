export type Archetype =
  | "Ruler"
  | "Creator"
  | "Caregiver"
  | "Innocent"
  | "Sage"
  | "Explorer"
  | "Outlaw"
  | "Magician"
  | "Hero"
  | "Lover"
  | "Jester"
  | "Everyman";

export type ArchetypeQuadrant = "Provide Structure" | "Yearn for Spiritual" | "Leave a Mark" | "Connect to Others";

export const ARCHETYPE_QUADRANTS: Record<Archetype, ArchetypeQuadrant> = {
  Ruler: "Provide Structure",
  Creator: "Provide Structure",
  Caregiver: "Provide Structure",
  Innocent: "Yearn for Spiritual",
  Sage: "Yearn for Spiritual",
  Explorer: "Yearn for Spiritual",
  Outlaw: "Leave a Mark",
  Magician: "Leave a Mark",
  Hero: "Leave a Mark",
  Lover: "Connect to Others",
  Jester: "Connect to Others",
  Everyman: "Connect to Others",
};

export interface ArchetypeData {
  name: Archetype;
  tagline: string;
  description: string;
  strengths: [string, string, string];
  challenges: [string, string, string];
  idealCareers: [string, string, string, string, string];
  relationshipStyle: string;
  shadowSide: string;
  famousExamples: [string, string, string];
  accentColor: string;
  icon: string;
  emoji: string;
}

export const ARCHETYPE_DATA: Record<Archetype, ArchetypeData> = {
  Ruler: {
    name: "Ruler",
    tagline: "Power isn't everything — it's the only thing.",
    description: "You're a natural-born leader with an instinct for control, responsibility, and legacy. You think in systems and strategy, always building toward something lasting.",
    strengths: ["Strategic leadership", "Decisive under pressure", "Organizational mastery"],
    challenges: ["Controlling tendencies", "Difficulty delegating", "Workaholic patterns"],
    idealCareers: ["CEO / Founder", "Political leader", "Executive director", "Operations strategist", "Military officer"],
    relationshipStyle: "You lead relationships with structure and loyalty, but must learn to share power.",
    shadowSide: "When unchecked, you become authoritarian — controlling others out of fear of losing grip.",
    famousExamples: ["Beyoncé", "Margaret Thatcher", "Steve Jobs"],
    accentColor: "#F59E0B",
    icon: "Crown",
    emoji: "👑",
  },
  Creator: {
    name: "Creator",
    tagline: "If you can imagine it, it can be made.",
    description: "You live to bring something new into the world. Whether it's art, code, or ideas — your deepest satisfaction comes from making something that didn't exist before.",
    strengths: ["Boundless imagination", "Original thinking", "Aesthetic sensitivity"],
    challenges: ["Perfectionism paralysis", "Difficulty with routine", "Overattachment to work"],
    idealCareers: ["Designer", "Writer / Author", "Filmmaker", "Architect", "Software developer"],
    relationshipStyle: "You express love through creation — gifts, experiences, and shared projects.",
    shadowSide: "Perfectionism becomes self-sabotage; nothing is ever good enough to ship.",
    famousExamples: ["Leonardo da Vinci", "Björk", "Hayao Miyazaki"],
    accentColor: "#8B5CF6",
    icon: "Palette",
    emoji: "🎨",
  },
  Caregiver: {
    name: "Caregiver",
    tagline: "Love your neighbor as yourself.",
    description: "You find meaning in service and nurturing others. Your empathy runs deep, and people instinctively trust you with their vulnerabilities.",
    strengths: ["Deep empathy", "Emotional intelligence", "Selfless dedication"],
    challenges: ["Burnout from over-giving", "Difficulty setting boundaries", "Neglecting own needs"],
    idealCareers: ["Therapist / Counselor", "Nurse / Doctor", "Teacher", "Social worker", "Nonprofit director"],
    relationshipStyle: "You pour yourself into your partner's wellbeing — but need to receive care too.",
    shadowSide: "Martyrdom — sacrificing yourself until resentment quietly poisons everything.",
    famousExamples: ["Mother Teresa", "Dolly Parton", "Fred Rogers"],
    accentColor: "#EC4899",
    icon: "Heart",
    emoji: "💝",
  },
  Innocent: {
    name: "Innocent",
    tagline: "Free to be you and me.",
    description: "You see the world through a lens of wonder and optimism. Your authenticity is magnetic, and you remind people that goodness still exists.",
    strengths: ["Radical optimism", "Authentic presence", "Infectious positivity"],
    challenges: ["Naïveté in harsh environments", "Avoidance of conflict", "Disillusionment risk"],
    idealCareers: ["Brand ambassador", "Early education teacher", "Wellness coach", "Community organizer", "Customer experience lead"],
    relationshipStyle: "You bring lightness and trust to relationships, but must build resilience for hard conversations.",
    shadowSide: "Denial — refusing to see problems until they become crises.",
    famousExamples: ["Tom Hanks", "Keanu Reeves", "Bob Ross"],
    accentColor: "#FBBF24",
    icon: "Sun",
    emoji: "🌟",
  },
  Sage: {
    name: "Sage",
    tagline: "The truth will set you free.",
    description: "You're driven by an insatiable need to understand. Knowledge isn't just power to you — it's meaning itself. You see patterns others miss.",
    strengths: ["Analytical depth", "Pattern recognition", "Wisdom under pressure"],
    challenges: ["Analysis paralysis", "Emotional detachment", "Intellectual elitism"],
    idealCareers: ["Researcher / Scientist", "Professor", "Strategic consultant", "Data analyst", "Philosopher / Writer"],
    relationshipStyle: "You connect through deep conversation and shared curiosity, but must remember to feel, not just think.",
    shadowSide: "Ivory tower syndrome — using knowledge as a wall against genuine human connection.",
    famousExamples: ["Albert Einstein", "Brené Brown", "Naval Ravikant"],
    accentColor: "#6366F1",
    icon: "BookOpen",
    emoji: "🦉",
  },
  Explorer: {
    name: "Explorer",
    tagline: "Don't fence me in.",
    description: "Freedom is your oxygen. You need to chart your own path, discover new territories, and resist anything that feels like a cage.",
    strengths: ["Fearless independence", "Adaptability", "Pioneering spirit"],
    challenges: ["Commitment avoidance", "Restlessness", "Alienating those who can't keep up"],
    idealCareers: ["Travel journalist", "Entrepreneur", "Field researcher", "Adventure guide", "Foreign correspondent"],
    relationshipStyle: "You need a partner who gives you space — and who's brave enough to explore with you.",
    shadowSide: "Perpetual wandering — running from commitment disguised as seeking freedom.",
    famousExamples: ["Anthony Bourdain", "Amelia Earhart", "Elon Musk"],
    accentColor: "#22D3EE",
    icon: "Compass",
    emoji: "🗺️",
  },
  Outlaw: {
    name: "Outlaw",
    tagline: "Rules are made to be broken.",
    description: "You see the cracks in every system and feel compelled to smash them open. Convention bores you; revolution fuels you.",
    strengths: ["Radical courage", "Disruptive innovation", "Unshakeable conviction"],
    challenges: ["Burning bridges", "Self-destructive tendencies", "Alienating allies"],
    idealCareers: ["Activist / Organizer", "Disruptive entrepreneur", "Investigative journalist", "Defense attorney", "Punk artist"],
    relationshipStyle: "Intense and passionate — you need someone who can handle your fire without trying to extinguish it.",
    shadowSide: "Destruction for its own sake — tearing things down with nothing to build in their place.",
    famousExamples: ["Malcolm X", "Steve Jobs (early era)", "Banksy"],
    accentColor: "#EF4444",
    icon: "Zap",
    emoji: "⚡",
  },
  Magician: {
    name: "Magician",
    tagline: "It's not impossible — just not yet invented.",
    description: "You transform reality. Where others see limitations, you see possibilities. Your vision bends the world toward something extraordinary.",
    strengths: ["Visionary thinking", "Transformative charisma", "Catalytic leadership"],
    challenges: ["Manipulation risk", "Grandiosity", "Losing touch with reality"],
    idealCareers: ["Innovation director", "Brand strategist", "Spiritual teacher", "Product visionary", "Transformation coach"],
    relationshipStyle: "You enchant and inspire your partners, but must stay grounded in honesty over mystique.",
    shadowSide: "Manipulation — using your charisma to control others for your own ends.",
    famousExamples: ["David Bowie", "Oprah Winfrey", "Nikola Tesla"],
    accentColor: "#A855F7",
    icon: "Sparkles",
    emoji: "✨",
  },
  Hero: {
    name: "Hero",
    tagline: "Where there's a will, there's a way.",
    description: "You prove your worth through courage and hard-won triumph. Adversity doesn't break you — it reveals you. Your story inspires others to fight their own battles.",
    strengths: ["Relentless determination", "Moral courage", "Inspirational resilience"],
    challenges: ["Savior complex", "Burnout from overcommitment", "Inability to show vulnerability"],
    idealCareers: ["Emergency responder", "Competitive athlete", "Military leader", "Trial lawyer", "Startup founder"],
    relationshipStyle: "You protect fiercely and love through action, but must learn that rest isn't weakness.",
    shadowSide: "The need to have an enemy — creating battles where none exist.",
    famousExamples: ["Malala Yousafzai", "Dwayne Johnson", "Winston Churchill"],
    accentColor: "#F97316",
    icon: "Shield",
    emoji: "🦸",
  },
  Lover: {
    name: "Lover",
    tagline: "You're the only one.",
    description: "You experience life through passion, beauty, and deep connection. Intimacy isn't just romantic — it's how you engage with everything that matters.",
    strengths: ["Emotional depth", "Passionate commitment", "Aesthetic appreciation"],
    challenges: ["Fear of rejection", "Losing identity in relationships", "Emotional volatility"],
    idealCareers: ["Relationship therapist", "Luxury brand curator", "Event designer", "Sommelier / Chef", "Creative director"],
    relationshipStyle: "All-in and deeply devoted — but you must maintain your identity outside the relationship.",
    shadowSide: "Obsession — love becoming possession, beauty becoming vanity.",
    famousExamples: ["Rumi", "Frida Kahlo", "John Legend"],
    accentColor: "#F43F5E",
    icon: "HeartHandshake",
    emoji: "💕",
  },
  Jester: {
    name: "Jester",
    tagline: "You only live once.",
    description: "You weaponize joy. Through humor and irreverence, you cut through pretension and remind everyone not to take life so seriously.",
    strengths: ["Disarming humor", "Creative spontaneity", "Social intelligence"],
    challenges: ["Avoiding depth", "Using humor as a shield", "Not being taken seriously"],
    idealCareers: ["Comedian / Entertainer", "Creative copywriter", "Game designer", "Improv teacher", "Marketing creative"],
    relationshipStyle: "You keep things light and fun, but must learn to sit with heavy emotions too.",
    shadowSide: "The mask — hiding profound pain behind an ever-smiling face.",
    famousExamples: ["Robin Williams", "Ryan Reynolds", "Dolly Parton"],
    accentColor: "#10B981",
    icon: "Laugh",
    emoji: "🃏",
  },
  Everyman: {
    name: "Everyman",
    tagline: "All people are created equal.",
    description: "You are the voice of the people. Your superpower is relatability — you make others feel seen, heard, and like they belong.",
    strengths: ["Universal relatability", "Grounded authenticity", "Community building"],
    challenges: ["Fear of standing out", "People-pleasing", "Playing it too safe"],
    idealCareers: ["HR director", "Community manager", "Union organizer", "Retail brand leader", "Public school principal"],
    relationshipStyle: "Loyal, steady, and deeply egalitarian — you build relationships on mutual respect.",
    shadowSide: "Losing yourself — blending in so completely that you forget who you actually are.",
    famousExamples: ["Dave Grohl", "Adele", "Keanu Reeves"],
    accentColor: "#64748B",
    icon: "Users",
    emoji: "🤝",
  },
};

export const ALL_ARCHETYPES: Archetype[] = [
  "Ruler", "Creator", "Caregiver", "Innocent", "Sage", "Explorer",
  "Outlaw", "Magician", "Hero", "Lover", "Jester", "Everyman",
];
