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

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What drives you most deeply?",
    subtitle: "Purpose & motivation",
    options: [
      { text: "Building something that lasts beyond me", archetype: "Ruler" },
      { text: "Expressing something no one has before", archetype: "Creator" },
      { text: "Understanding how everything connects", archetype: "Sage" },
      { text: "Exploring what's beyond the horizon", archetype: "Explorer" },
      { text: "Fighting for what's right", archetype: "Hero" },
      { text: "Making people feel truly alive", archetype: "Magician" },
    ],
  },
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
      { text: "\"You always know exactly what to do\"", archetype: "Ruler" },
    ],
  },
  {
    id: 4,
    question: "Your ideal weekend looks like:",
    subtitle: "Lifestyle & energy",
    options: [
      { text: "A solo adventure somewhere I've never been", archetype: "Explorer" },
      { text: "Deep in a creative project, losing track of time", archetype: "Creator" },
      { text: "A long dinner with close friends, real conversation", archetype: "Lover" },
      { text: "Volunteering or helping someone who needs it", archetype: "Caregiver" },
      { text: "A spontaneous day with zero plans", archetype: "Jester" },
      { text: "Reading, learning, going down rabbit holes", archetype: "Sage" },
    ],
  },
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
      { text: "Keep the energy up and the team motivated", archetype: "Hero" },
    ],
  },
  {
    id: 6,
    question: "The thing that frustrates you most:",
    subtitle: "Shadow & triggers",
    options: [
      { text: "Incompetence and lack of standards", archetype: "Ruler" },
      { text: "Closed-mindedness and dogma", archetype: "Explorer" },
      { text: "Superficiality — people who won't go deeper", archetype: "Sage" },
      { text: "Injustice and people abusing power", archetype: "Outlaw" },
      { text: "Cynicism — people who've given up on hope", archetype: "Innocent" },
      { text: "Disconnection — people not being real with each other", archetype: "Lover" },
    ],
  },
  {
    id: 7,
    question: "People come to you when they need:",
    subtitle: "Perceived strength",
    options: [
      { text: "A plan — clear thinking and direction", archetype: "Sage" },
      { text: "Comfort — someone who truly listens", archetype: "Caregiver" },
      { text: "Energy — a boost of motivation", archetype: "Hero" },
      { text: "A laugh — someone to lighten the load", archetype: "Jester" },
      { text: "Honesty — someone who'll tell them the truth", archetype: "Outlaw" },
      { text: "Inspiration — a new way of seeing things", archetype: "Magician" },
    ],
  },
  {
    id: 8,
    question: "Your biggest fear is:",
    subtitle: "Core vulnerability",
    options: [
      { text: "Being powerless or irrelevant", archetype: "Ruler" },
      { text: "Living an ordinary, unexplored life", archetype: "Explorer" },
      { text: "Being alone or unloved", archetype: "Lover" },
      { text: "Being ignorant or wrong", archetype: "Sage" },
      { text: "Being forgotten — leaving no mark", archetype: "Hero" },
      { text: "Being trapped in someone else's system", archetype: "Outlaw" },
    ],
  },
];
