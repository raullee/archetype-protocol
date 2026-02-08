import { Archetype } from "./archetypes";

type Question = {
  question: string;
  answers: {
    text: string;
    archetype: Archetype;
  }[];
};

export const questions: Question[] = [
  {
    question: "What drives you most when creating music?",
    answers: [
      { text: "Pushing the boundaries of technical perfection and mastery", archetype: "The Virtuoso" },
      { text: "Building my brand and creating multiple income streams", archetype: "The Hustler" },
      { text: "Exploring new sounds and pioneering uncharted musical territory", archetype: "The Visionary" },
      { text: "Working with other artists to create something greater together", archetype: "The Collaborator" },
      { text: "Connecting with audiences and creating unforgettable live moments", archetype: "The Performer" },
      { text: "Crafting the perfect sonic landscape and bringing musical visions to life", archetype: "The Producer" },
    ],
  },
  {
    question: "Your ideal Friday night involves:",
    answers: [
      { text: "Practicing scales or working on technique for hours", archetype: "The Virtuoso" },
      { text: "Networking at an industry event or planning your next business move", archetype: "The Hustler" },
      { text: "Experimenting with strange new sounds in your studio", archetype: "The Visionary" },
      { text: "Jamming with friends or co-writing with another artist", archetype: "The Collaborator" },
      { text: "Performing live or watching an incredible live show", archetype: "The Performer" },
      { text: "Mixing tracks or perfecting the sound of a recording", archetype: "The Producer" },
    ],
  },
  {
    question: "When you hear a great song, your first thought is:",
    answers: [
      { text: "How technically complex and skillfully executed it is", archetype: "The Virtuoso" },
      { text: "How smart the marketing strategy behind it must be", archetype: "The Hustler" },
      { text: "What innovative elements make it unique and groundbreaking", archetype: "The Visionary" },
      { text: "How well the artists worked together and complemented each other", archetype: "The Collaborator" },
      { text: "How incredible this would be to perform live", archetype: "The Performer" },
      { text: "How perfectly everything is mixed and arranged", archetype: "The Producer" },
    ],
  },
  {
    question: "Your biggest musical inspiration comes from:",
    answers: [
      { text: "Masters who've achieved technical perfection in their craft", archetype: "The Virtuoso" },
      { text: "Artists who've built empires and changed the game", archetype: "The Hustler" },
      { text: "Pioneers who invented new genres or sounds", archetype: "The Visionary" },
      { text: "Legendary partnerships and musical duos", archetype: "The Collaborator" },
      { text: "Iconic live performers and stage legends", archetype: "The Performer" },
      { text: "Innovative producers who shaped the sound of music", archetype: "The Producer" },
    ],
  },
  {
    question: "If you could only focus on one aspect of music, it would be:",
    answers: [
      { text: "Mastering my instrument to the highest possible level", archetype: "The Virtuoso" },
      { text: "Building a sustainable and profitable music career", archetype: "The Hustler" },
      { text: "Creating something the world has never heard before", archetype: "The Visionary" },
      { text: "Making beautiful music with other talented artists", archetype: "The Collaborator" },
      { text: "Moving and connecting with live audiences", archetype: "The Performer" },
      { text: "Crafting perfect recordings and sonic experiences", archetype: "The Producer" },
    ],
  },
  {
    question: "Your dream collaboration would be:",
    answers: [
      { text: "Working with the most technically skilled musicians in the world", archetype: "The Virtuoso" },
      { text: "Partnering with successful artists who understand business", archetype: "The Hustler" },
      { text: "Creating with avant-garde artists pushing creative boundaries", archetype: "The Visionary" },
      { text: "Being part of a creative collective where everyone elevates each other", archetype: "The Collaborator" },
      { text: "Sharing the stage with legendary live performers", archetype: "The Performer" },
      { text: "Working with artists who trust your vision for their sound", archetype: "The Producer" },
    ],
  },
  {
    question: "When planning your music career, you prioritize:",
    answers: [
      { text: "Continuous improvement and skill development", archetype: "The Virtuoso" },
      { text: "Strategic growth and multiple revenue streams", archetype: "The Hustler" },
      { text: "Artistic integrity and creative freedom", archetype: "The Visionary" },
      { text: "Building strong relationships within the music community", archetype: "The Collaborator" },
      { text: "Getting in front of as many live audiences as possible", archetype: "The Performer" },
      { text: "Developing your signature sound and production style", archetype: "The Producer" },
    ],
  },
  {
    question: "Your favorite part of the music creation process is:",
    answers: [
      { text: "The disciplined practice and technical execution", archetype: "The Virtuoso" },
      { text: "The strategy and planning behind the release", archetype: "The Hustler" },
      { text: "The initial spark of a completely original idea", archetype: "The Visionary" },
      { text: "The energy and chemistry of working with others", archetype: "The Collaborator" },
      { text: "Imagining how the song will feel performed live", archetype: "The Performer" },
      { text: "Shaping and refining the sonic details", archetype: "The Producer" },
    ],
  },
  {
    question: "If money wasn't a factor, you'd spend your time:",
    answers: [
      { text: "Studying with the greatest masters and perfecting your craft", archetype: "The Virtuoso" },
      { text: "Building the ultimate music empire and helping other artists succeed", archetype: "The Hustler" },
      { text: "Creating experimental art that challenges everything about music", archetype: "The Visionary" },
      { text: "Facilitating magical creative sessions with incredible artists", archetype: "The Collaborator" },
      { text: "Touring the world and performing for massive audiences", archetype: "The Performer" },
      { text: "Building the perfect studio and crafting legendary recordings", archetype: "The Producer" },
    ],
  },
  {
    question: "Your musical superpower is:",
    answers: [
      { text: "Technical precision that leaves other musicians in awe", archetype: "The Virtuoso" },
      { text: "The ability to spot opportunities and turn music into profit", archetype: "The Hustler" },
      { text: "Seeing musical possibilities that don't exist yet", archetype: "The Visionary" },
      { text: "Bringing out the best in every musician you work with", archetype: "The Collaborator" },
      { text: "Creating an electric connection with any audience", archetype: "The Performer" },
      { text: "Hearing exactly what a song needs to reach its potential", archetype: "The Producer" },
    ],
  },
  {
    question: "The most rewarding moment in music for you is:",
    answers: [
      { text: "Nailing a piece that previously seemed impossible to play", archetype: "The Virtuoso" },
      { text: "Seeing your strategic plan result in career breakthrough", archetype: "The Hustler" },
      { text: "Creating something that shifts how people think about music", archetype: "The Visionary" },
      { text: "When creative chemistry leads to an unexpected masterpiece", archetype: "The Collaborator" },
      { text: "That moment when the entire crowd is singing along", archetype: "The Performer" },
      { text: "When the final mix perfectly captures the emotional vision", archetype: "The Producer" },
    ],
  },
  {
    question: "Your approach to musical challenges is:",
    answers: [
      { text: "Practice relentlessly until you've mastered every detail", archetype: "The Virtuoso" },
      { text: "Find creative ways to turn obstacles into opportunities", archetype: "The Hustler" },
      { text: "Use them as inspiration to create something completely new", archetype: "The Visionary" },
      { text: "Collaborate with others to find solutions together", archetype: "The Collaborator" },
      { text: "Channel the energy into an even more powerful performance", archetype: "The Performer" },
      { text: "Experiment with different sonic approaches until it clicks", archetype: "The Producer" },
    ],
  },
  {
    question: "You want to be remembered for:",
    answers: [
      { text: "Setting the gold standard for musical excellence", archetype: "The Virtuoso" },
      { text: "Building a lasting musical empire and helping others succeed", archetype: "The Hustler" },
      { text: "Changing the course of music history with your innovations", archetype: "The Visionary" },
      { text: "Being the catalyst that helped create incredible musical magic", archetype: "The Collaborator" },
      { text: "Creating unforgettable moments that live in people's hearts forever", archetype: "The Performer" },
      { text: "Crafting the sonic landscapes that defined a generation", archetype: "The Producer" },
    ],
  },
];