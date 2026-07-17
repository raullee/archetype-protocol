import { Archetype } from "./archetypes";

export interface QuizOption {
  text: string;
  archetype: Archetype;
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

/**
 * ── WEIGHT-TIER BALANCED DESIGN ─────────────────────────────────────────
 *
 * This layout is load-bearing. Do not add, remove, or re-map an option without
 * re-running `npx tsx scripts/audit-instrument.ts`, which enumerates all
 * 6^8 = 1,679,616 answer paths and fails the build on imbalance.
 *
 * Two properties are enforced:
 *
 *   1. COUNT BALANCE. Every archetype is offered in exactly 4 of 8 questions
 *      (8 x 6 = 48 slots / 12 archetypes = 4 each, exactly).
 *
 *   2. WEIGHT BALANCE. Questions carry different weights (see QUESTION_WEIGHTS
 *      in utils/calculateArchetype.ts), so equal COUNTS are not enough: an
 *      archetype offered only on light questions can never compete with one
 *      offered on heavy questions. The 8 questions therefore pair into 4 tiers,
 *      and each tier's two questions PARTITION all 12 archetypes 6/6 -- so every
 *      archetype draws exactly one question from each tier.
 *
 *        Tier A (heavy)  Q1 1.6 core drive   | Q8 1.5 core fear
 *        Tier B          Q6 1.2 shadow       | Q3 1.1 values
 *        Tier C          Q2 1.0 stress       | Q7 0.9 perceived strength
 *        Tier D (light)  Q5 0.8 team         | Q4 0.7 lifestyle
 *
 *      Total available weight per archetype lands in 4.2-4.6 (ideal 4.4),
 *      versus 3.4-5.1 under count-balance alone.
 *
 * History: originally Ruler/Sage appeared in 6 questions and Innocent/Everyman
 * in 2, which -- combined with ties resolving to array order -- made Ruler the
 * primary result on 27.6% of all answer paths against Everyman's 0.5%. A 54x
 * spread on an instrument that should sit near 8.33% each.
 */
export const QUESTIONS: QuizQuestion[] = [
  // ── Tier A ── Q1 (1.6): partitions the 12 with Q8.
  {
    id: 1,
    question: "What drives you most deeply?",
    subtitle: "Purpose & motivation",
    options: [
      { text: "Building something that lasts beyond me", archetype: "Ruler" },
      { text: "Expressing something no one has before", archetype: "Creator" },
      { text: "Keeping something pure in a cynical scene", archetype: "Innocent" },
      { text: "Exploring what's beyond the horizon", archetype: "Explorer" },
      { text: "Fighting for what's right", archetype: "Hero" },
      { text: "Making people feel truly alive", archetype: "Magician" },
    ],
  },
  // ── Tier C ── Q2 (1.0): partitions the 12 with Q7.
  {
    id: 2,
    question: "In a crisis, you instinctively...",
    subtitle: "Stress response",
    options: [
      { text: "Take command and organize everyone", archetype: "Ruler" },
      { text: "Stay calm, analyze, find the root cause", archetype: "Sage" },
      { text: "Drop everything to help those affected", archetype: "Caregiver" },
      { text: "Challenge whoever caused the problem", archetype: "Outlaw" },
      { text: "Charge in headfirst to fix it", archetype: "Hero" },
      { text: "Lighten the mood so people can think clearly", archetype: "Jester" },
    ],
  },
  // ── Tier B ── Q3 (1.1): partitions the 12 with Q6.
  {
    id: 3,
    question: "The compliment that means most to you:",
    subtitle: "Core values",
    options: [
      { text: "\"You always see the best in people\"", archetype: "Innocent" },
      { text: "\"You made something truly original\"", archetype: "Creator" },
      { text: "\"You changed my perspective entirely\"", archetype: "Magician" },
      { text: "\"You make everyone feel welcome\"", archetype: "Everyman" },
      { text: "\"You're the most passionate person I know\"", archetype: "Lover" },
      { text: "\"Nothing is ever boring around you\"", archetype: "Jester" },
    ],
  },
  // ── Tier D ── Q4 (0.7): partitions the 12 with Q5.
  {
    id: 4,
    question: "Your ideal weekend looks like:",
    subtitle: "Lifestyle & energy",
    options: [
      { text: "A solo adventure somewhere I've never been", archetype: "Explorer" },
      { text: "Deep in a creative project, losing track of time", archetype: "Creator" },
      { text: "A long dinner with close friends, real conversation", archetype: "Lover" },
      { text: "Training hard and chasing a goal I've set myself", archetype: "Hero" },
      { text: "A spontaneous day with zero plans", archetype: "Jester" },
      { text: "Reading, learning, going down rabbit holes", archetype: "Sage" },
    ],
  },
  // ── Tier D ── Q5 (0.8): partitions the 12 with Q4.
  {
    id: 5,
    question: "In a group project, you naturally:",
    subtitle: "Team dynamics",
    options: [
      { text: "Take the lead and set the direction", archetype: "Ruler" },
      { text: "Come up with the big, wild idea", archetype: "Magician" },
      { text: "Make sure everyone's voice is heard", archetype: "Everyman" },
      { text: "Do whatever needs doing, quietly", archetype: "Caregiver" },
      { text: "Push back on bad ideas, even if it's unpopular", archetype: "Outlaw" },
      { text: "Keep faith it'll come together, even when it's messy", archetype: "Innocent" },
    ],
  },
  // ── Tier B ── Q6 (1.2): partitions the 12 with Q3.
  {
    id: 6,
    question: "The thing that frustrates you most:",
    subtitle: "Shadow & triggers",
    options: [
      { text: "Incompetence and lack of standards", archetype: "Ruler" },
      { text: "Closed-mindedness and dogma", archetype: "Explorer" },
      { text: "Superficiality, and people who won't go deeper", archetype: "Sage" },
      { text: "Injustice and people abusing power", archetype: "Outlaw" },
      { text: "Selfishness, and people who won't help when they could", archetype: "Caregiver" },
      { text: "Cowardice, and people who won't step up", archetype: "Hero" },
    ],
  },
  // ── Tier C ── Q7 (0.9): partitions the 12 with Q2.
  {
    id: 7,
    question: "People come to you when they need:",
    subtitle: "Perceived strength",
    options: [
      { text: "A fresh idea, something nobody has tried", archetype: "Creator" },
      { text: "Hope, from someone who still believes", archetype: "Innocent" },
      { text: "Perspective, from someone who has been out there", archetype: "Explorer" },
      { text: "Inspiration, a new way of seeing things", archetype: "Magician" },
      { text: "Passion, from someone who cares deeply", archetype: "Lover" },
      { text: "Company, from someone who just gets it", archetype: "Everyman" },
    ],
  },
  // ── Tier A ── Q8 (1.5): partitions the 12 with Q1.
  {
    id: 8,
    question: "Your biggest fear is:",
    subtitle: "Core vulnerability",
    options: [
      { text: "Being ignorant or wrong", archetype: "Sage" },
      { text: "Being alone or unloved", archetype: "Lover" },
      { text: "Being trapped in someone else's system", archetype: "Outlaw" },
      { text: "Being needed by no one", archetype: "Caregiver" },
      { text: "Being the boring one in the room", archetype: "Jester" },
      { text: "Not belonging anywhere", archetype: "Everyman" },
    ],
  },
];
