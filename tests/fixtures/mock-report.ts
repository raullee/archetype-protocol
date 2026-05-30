/**
 * Pre-written report sections per tier for deterministic test output generation.
 */

export interface ReportSection {
  title: string;
  content: string;
  pullQuote?: string;
}

// ─── BASIC TIER ──────────────────────────────────────────────

export const BASIC_SECTIONS: ReportSection[] = [
  {
    title: 'Your Core Archetype Identity',
    content:
      'You are the Creator/Sage — a rare combination that lives at the intersection of imagination and intellect. Where most artists create from pure feeling, you create from understanding. Your music isn\'t just made — it\'s architected.\n\nThe Creator in you demands originality. You physically cannot replicate what\'s been done before without feeling like a fraud. Every project must push into unmapped territory, whether that\'s a new production technique, an unconventional song structure, or a concept that hasn\'t been explored in your genre.\n\nThe Sage ensures that this creativity isn\'t random — it\'s informed. You study your influences obsessively. You understand music theory not because someone made you learn it, but because understanding the rules is the prerequisite to breaking them intelligently.',
    pullQuote: 'You don\'t just make music — you architect sonic worlds.',
  },
  {
    title: 'Your Sonic Signature',
    content:
      'The Creator/Sage produces music that is intellectually stimulating yet emotionally resonant. Your sonic fingerprint typically includes:\n\n**Textural Complexity:** You layer sounds not for density but for meaning. Each element serves a purpose — if it doesn\'t advance the composition, it\'s removed.\n\n**Structural Innovation:** Verse-chorus-verse bores you. Your songs evolve, modulate, and surprise. You\'re drawn to through-composed structures, unexpected key changes, and arrangements that reward repeated listening.\n\n**Referential Depth:** Your music contains hidden references — to other artists, to literary works, to philosophical concepts. The casual listener enjoys the surface; the devoted fan discovers new layers with each listen.\n\n**Production Philosophy:** Clean but not sterile. Precise but not lifeless. You spend disproportionate time on the details most listeners will never consciously notice — but those details are why your work feels "different" without people being able to articulate why.',
    pullQuote: 'Every frequency has a purpose. Nothing is accidental.',
  },
  {
    title: 'Your Stage Persona',
    content:
      'On stage, the Creator/Sage is the anti-performer — and paradoxically, this becomes the performance. You don\'t work the crowd with rehearsed banter or calculated energy spikes. Instead, you create an atmosphere of focused intensity that pulls the audience into your world rather than projecting yourself into theirs.\n\nThink Thom Yorke\'s twitching, eyes-closed immersion. Think James Blake\'s seated, minimal-movement sets where the music does all the talking. Think Bon Iver\'s early shows — a man, a cabin, a microphone, and a devastating amount of intention.\n\nYour stage presence communicates: "I\'m not here to entertain you — I\'m here to show you something." Audiences either find this magnetic or frustrating. The ones who find it magnetic become lifers.\n\n**Performance Risk:** Over-reliance on technical precision can make live shows feel like playback sessions. Introduce one element of genuine risk per set — an improvised section, a cover you haven\'t rehearsed, a moment where the arrangement deliberately falls apart and rebuilds.',
    pullQuote: 'Your stage presence is an invitation, not a performance.',
  },
  {
    title: 'Your Creative Process',
    content:
      'The Creator/Sage has a distinctive four-phase creative cycle:\n\n**Phase 1: Absorption (Days 1-7)**\nYou consume voraciously — music, films, books, conversations, documentaries. This isn\'t procrastination (though it feels like it). Your Sage is building the knowledge base that your Creator will draw from.\n\n**Phase 2: Incubation (Days 7-14)**\nIdeas begin connecting below conscious awareness. You might wake up with a melody, hear a rhythm in traffic, or suddenly understand how two unrelated concepts connect sonically. Don\'t force this phase — it\'s doing the work.\n\n**Phase 3: Eruption (Days 14-21)**\nWhen it hits, it hits hard. You enter flow states that can last 8-12 hours. During eruption, your Creator takes the wheel while your Sage provides quality control in real-time. This is when your best work emerges.\n\n**Phase 4: Refinement (Days 21-30+)**\nYour Sage takes over completely. Editing, mixing, mastering, contextualizing. This phase is where the Creator/Sage\'s perfectionism can become dangerous — "refinement" can become an infinite loop if you don\'t set hard deadlines.\n\n**Process Optimization:** Schedule Absorption and Incubation phases deliberately. Most Creator/Sages wait for inspiration to strike, then binge-create. Instead, maintain a consistent intake habit and your creative output will become more predictable.',
    pullQuote: 'Your process isn\'t linear — it\'s a spiral that tightens until something breaks through.',
  },
  {
    title: 'Your Blind Spot',
    content:
      'The Creator/Sage\'s Achilles heel is **analysis paralysis disguised as quality control**.\n\nYou genuinely believe you\'re still working on the piece. In reality, you\'re afraid it isn\'t smart enough, original enough, or technically flawless enough to represent your capabilities. So you keep "refining" — adding another layer, reworking the bridge, reimagining the concept — until the project either dies quietly on a hard drive or ships so late it misses its cultural moment.\n\n**The Numbers:** Creator/Sage archetypes complete an average of 1 in 4 started projects. The other 3 aren\'t abandoned — they\'re in perpetual "almost done" purgatory.\n\n**The Fix:** Adopt the "70% Rule" — if a piece is 70% of your vision, ship it. Your 70% is most artists\' 95%. The remaining 30% exists only in your head and the audience will never miss it.\n\n**Second Blind Spot: Intellectual Elitism**\nYour Sage can become dismissive of music that doesn\'t meet your intellectual standards. Pop hooks feel cheap. Simple chord progressions feel lazy. Commercially successful artists feel like sellouts. This isn\'t just snobbery — it\'s a defense mechanism against the fear that accessibility and depth are incompatible. They\'re not. The best Creator/Sages prove that every day.',
    pullQuote: 'Your biggest enemy isn\'t a lack of talent — it\'s an excess of standards.',
  },
];

// ─── FULL TIER ───────────────────────────────────────────────

export const FULL_SECTIONS: ReportSection[] = [
  ...BASIC_SECTIONS,
  {
    title: 'Your Shadow Archetype',
    content:
      'Every archetype has a shadow — the distorted version that emerges under stress, ego inflation, or sustained creative frustration. The Creator/Sage\'s shadow is **The Ivory Tower Hermit**.\n\nWhen the shadow takes over, you retreat from the world entirely. Your Creator stops producing and starts consuming obsessively — you become a collector of references rather than a maker of art. Your Sage becomes hyper-critical, finding fatal flaws in everything (including your own work) while producing nothing.\n\n**Shadow Triggers:**\n- Negative reception of work you considered important\n- Commercial failure of a project you believed in\n- Watching a less talented artist achieve the recognition you deserve\n- Extended periods without creative output\n\n**Shadow Behaviors:**\n- Withdrawal from social media, networking, and public presence\n- Starting 10 projects and finishing none\n- Increasingly obscure artistic references that alienate your audience\n- Dismissing entire genres, platforms, or audiences as "beneath you"\n\n**Shadow Recovery:**\nThe antidote is deliberate simplicity. Write a three-chord song. Record it on your phone. Post it with zero context. The Creator/Sage\'s shadow feeds on the belief that everything must be profound. Sometimes the most courageous act is making something small.',
    pullQuote: 'Your shadow doesn\'t create — it critiques from a tower no one can reach.',
  },
  {
    title: 'Your Character Arc',
    content:
      '**The Three-Act Arc of the Creator/Sage Artist**\n\n**Act I: The Emerging Polymath (Years 1-3)**\nYou arrive in the music world with more knowledge than experience. You\'ve studied the greats, you understand theory and history, you have strong opinions about what\'s good and what\'s derivative. Your early work is technically impressive but emotionally guarded — you\'re performing competence rather than vulnerability.\n\nKey challenge: Getting out of your head and into the room. Your first collaborations will be uncomfortable because you\'ll want to control the creative direction. Let them be messy.\n\n**Act II: The Frustrated Visionary (Years 3-7)**\nYou\'ve developed enough skill to realize how far you are from your vision. This is the most dangerous phase — the gap between taste and ability feels unbridgeable. Less principled archetypes would compromise; you double down.\n\nThis is where many Creator/Sages quit, pivot to production/engineering, or become music journalists instead of musicians. The ones who survive Act II do so by finding one collaborator who believes in their vision when they no longer believe in it themselves.\n\nKey challenge: Accepting that your audience doesn\'t need to understand your references to be moved by your music.\n\n**Act III: The Master Alchemist (Years 7+)**\nThe Creator/Sage who reaches Act III becomes genuinely formidable. Your accumulated knowledge, refined craft, and hard-won emotional honesty converge into work that is simultaneously intellectual and accessible, innovative and timeless.\n\nArtists who reached Act III: Radiohead (post-OK Computer), Björk (post-Homogenic), Frank Ocean (post-Channel Orange), Kendrick Lamar (DAMN. onward).\n\nKey challenge: Avoiding the nostalgia trap — the temptation to keep recreating your Act II breakthrough instead of continuing to evolve.',
    pullQuote: 'Your arc isn\'t about finding your voice — it\'s about trusting it.',
  },
  {
    title: 'Archetype Tensions',
    content:
      'The Creator and the Sage are natural allies — but their partnership contains productive tensions that define your artistic identity.\n\n**Tension #1: Making vs. Understanding**\nThe Creator wants to produce. The Sage wants to study. When these drives are balanced, you create work that is both original and informed. When they\'re imbalanced, you either create without depth (Creator dominance) or theorize without producing (Sage dominance).\n\nCurrent risk: Sage dominance. Your research phase tends to expand to fill available time.\n\n**Tension #2: Innovation vs. Rigor**\nThe Creator breaks rules. The Sage respects them. This tension is the source of your best work — you break rules intelligently, understanding exactly why they existed and what you\'re sacrificing by departing from convention.\n\nBut it can also paralyze you when the Creator proposes something radical and the Sage immediately generates 12 reasons it might not work.\n\n**Tension #3: Audience vs. Self**\nThe Creator creates for self-expression. The Sage seeks recognition for knowledge and insight. When the audience doesn\'t receive your work the way you intended, the Creator is disappointed but resilient. The Sage, however, questions whether the audience is intelligent enough to appreciate the work — a dangerous path toward irrelevance.\n\n**Using Tensions Productively:** Assign each archetype a role in your process. Let the Creator lead during writing and recording. Let the Sage lead during mixing, mastering, and marketing. Never let one dominate both phases.',
    pullQuote: 'Your two selves argue constantly — and the music is what they agree on.',
  },
  {
    title: '90-Day Growth Roadmap',
    content:
      '**Phase 1: Weeks 1-4 — The Simplicity Challenge**\n\nObjective: Override the Sage\'s complexity addiction.\n\n- Week 1: Write one song using only 3 chords and 20 words. No bridges, no key changes, no production tricks. Record on your phone.\n- Week 2: Collaborate with someone who creates purely by feel. No theory discussions allowed. Communicate only through sound.\n- Week 3: Release something publicly that you consider "unfinished." Post it to one platform with minimal context.\n- Week 4: Attend a live show of an artist you consider "basic." Study why the audience connects. Write down 3 things they do better than you.\n\nAnti-perfectionism protocol: If you spend more than 4 hours on any single creative task this month, stop and move to the next one.\n\n**Phase 2: Weeks 5-8 — The Vulnerability Injection**\n\nObjective: Access the emotional rawness the Creator/Sage typically guards.\n\n- Week 5: Write a song about something you\'re genuinely afraid of. Not metaphorically — literally.\n- Week 6: Record vocals with zero processing. Keep every crack, breath, and imperfection.\n- Week 7: Share your creative process publicly — the mess, the failures, the uncertainty. Not the polished behind-the-scenes content.\n- Week 8: Ask 5 people (not musicians) what they feel when they hear your music. Listen without defending or explaining.\n\n**Phase 3: Weeks 9-12 — The Integration Sprint**\n\nObjective: Merge simplified expression with your natural depth.\n\n- Week 9: Take your favorite creation from Phase 1 and develop it with full Creator/Sage resources. Let the Sage enhance what the Creator started.\n- Week 10: Perform the vulnerable material from Phase 2 live (open mic, livestream, or private show for friends).\n- Week 11: Create a cohesive 3-track EP that demonstrates range: one simple piece, one vulnerable piece, one complex piece.\n- Week 12: Release it. Set a date now. Tell someone. Make it irreversible.\n\n**Success Metrics:**\n- [ ] Completed and released at least 3 pieces of work\n- [ ] Received emotional (not just technical) feedback from listeners\n- [ ] Maintained one creative partnership through the full 90 days\n- [ ] Reduced average time-to-completion by 30%+',
    pullQuote: 'The roadmap isn\'t about becoming less — it\'s about becoming more deliberately.',
  },
  {
    title: 'Your Ideal Collaborators',
    content:
      'The Creator/Sage thrives with specific collaborator archetypes:\n\n**The Emotional Amplifier (Hero/Lover)**\nThis person brings raw passion and conviction that cuts through your intellectual processing. They sing from the gut while you construct from the brain. Together, you create music that is both felt and thought. Warning: their intensity can overwhelm your need for creative control.\n\n**The Chaos Agent (Outlaw/Jester)**\nThis person breaks everything you build — and that\'s exactly what you need. They introduce randomness into your carefully structured process, creating happy accidents you\'d never discover alone. Warning: their disregard for craft can trigger your Sage\'s judgment.\n\n**The Strategic Partner (Ruler/Magician)**\nThis person handles the business side you neglect. While you create, they build the infrastructure — booking, branding, distribution, audience development. Warning: their commercial instincts may conflict with your artistic purity.\n\n**The Grounding Force (Everyman/Caregiver)**\nThis person keeps you connected to audiences you might intellectually dismiss. They remind you that the barista who cries to your song matters as much as the music critic who analyzes it. Warning: their simplicity can feel underwhelming to your Sage.\n\n**The Mirror (Creator/Sage)**\nAnother Creator/Sage can be either your most productive or most destructive partnership. You\'ll challenge each other intellectually and creatively — but two perfectionist, knowledge-driven artists in one room can create an infinite refinement loop where nothing ships.',
    pullQuote: 'Your ideal team doesn\'t think like you — they feel where you think, and act where you analyze.',
  },
  {
    title: 'Your Artist Manifesto',
    content:
      'I create because understanding is not enough.\n\nI have spent my life absorbing — studying the masters, deconstructing the greats, mapping the architecture of sound and meaning. But knowledge without expression is a library with no readers, a telescope pointed at a wall.\n\nI make music that rewards attention. Not because I\'m elitist, but because I believe my audience deserves more than background noise. Every note I place is chosen. Every silence is measured. Every imperfection — and yes, I\'m learning to leave them in — is a door into something real.\n\nI refuse to choose between intelligence and emotion. The world tells artists they must be either cerebral or visceral, either accessible or profound. I reject the binary. The best music I know — the music that changed me — is both.\n\nI will not be rushed. I will not be simplified. I will not apologize for caring about the details no one else notices. But I will learn to ship before it\'s perfect, to share before I\'m ready, to create before I understand.\n\nBecause the Creator and the Sage have one thing in common: they both know that the work is never finished. The difference between art and an unfinished draft is the courage to call it done.\n\nThis is my manifesto. This is my architecture. This is my sound.\n\n— A Creator/Sage who is learning to build doors instead of walls.',
    pullQuote: 'Knowledge without expression is a library with no readers.',
  },
];

// ─── COUPLES TIER ────────────────────────────────────────────

export const COUPLES_SECTIONS: ReportSection[] = [
  // Artist 1 sections (Creator/Sage)
  {
    title: 'PART I — Artist 1: The Creator/Sage',
    content:
      'The Creator/Sage is the intellectual architect of this partnership. Where others create from instinct, you create from understanding — and that distinction defines everything about your artistic identity, your process, and your contribution to this duo.\n\nYour primary drive is originality informed by knowledge. You don\'t just want to make something new — you want to understand why it\'s new, how it connects to what came before, and what it means in the broader context of your genre\'s evolution.',
    pullQuote: 'You don\'t just create — you understand why you create.',
  },
  {
    title: 'Artist 1: Sonic Signature & Process',
    content:
      'Your sonic fingerprint is characterized by textural complexity, structural innovation, and referential depth. Every element in your productions serves a deliberate purpose.\n\nYour four-phase creative cycle (Absorption → Incubation → Eruption → Refinement) produces work of exceptional quality but at a pace that can frustrate more action-oriented partners.\n\n**In this partnership:** Your production instincts provide the sonic foundation. You\'re the one who ensures the music rewards repeated listening, who catches the dissonance that shouldn\'t be there (or insists on the one that should), and who pushes arrangements beyond the obvious.',
    pullQuote: 'Your production is the invisible architecture that makes everything else possible.',
  },
  {
    title: 'PART II — Artist 2: The Hero/Outlaw',
    content:
      'The Hero/Outlaw is the kinetic force of this partnership. Where the Creator/Sage builds worlds, you charge through them. Your combination of determination (Hero) and rebellion (Outlaw) creates an artist who doesn\'t just perform — they confront.\n\nYour primary drive is transformation through confrontation. You make music that demands a response. Your shows are events. Your lyrics are challenges. Your presence is a statement.',
    pullQuote: 'You don\'t ask for attention — you command it.',
  },
  {
    title: 'Artist 2: Stage Presence & Energy',
    content:
      'On stage, the Hero/Outlaw is magnetic chaos. Where the Creator/Sage creates atmosphere through restraint, you create it through intensity. Your performances are physical, confrontational, and genuinely unpredictable.\n\nThe Hero in you drives inspirational moments — the climactic chorus, the triumphant bridge, the we-survived-this energy. The Outlaw provides the edge — the smashed expectation, the unplanned deviation, the moment where the audience isn\'t sure what\'s going to happen next.\n\n**In this partnership:** You\'re the live show. Your energy translates what the Creator/Sage builds in the studio into visceral, in-the-moment experience. Without you, the music might be appreciated. With you, it\'s felt.',
    pullQuote: 'You turn songs into war cries and stages into battlefields.',
  },
  {
    title: 'PART III — Partnership Dynamics: Creator/Sage × Hero/Outlaw',
    content:
      'This is one of the highest-potential creative partnerships in the archetype system — and one of the highest-risk.\n\nThe Creator/Sage and Hero/Outlaw occupy opposite corners of the archetype wheel: one seeks to understand, the other seeks to act. One builds carefully, the other breaks fearlessly. One refines endlessly, the other ships immediately. This polarity is precisely what makes the partnership extraordinary when it works — and explosive when it doesn\'t.',
    pullQuote: 'Opposite archetypes create the most powerful — and volatile — partnerships.',
  },
  {
    title: 'Compatibility Matrix',
    content:
      '**Creative Synergy: 92%**\nThe intellectual depth of the Creator/Sage combined with the visceral energy of the Hero/Outlaw produces music that is simultaneously cerebral and physical. Think Radiohead meets Rage Against the Machine. This score is near-maximum because the archetypes\' strengths cover each other\'s blind spots almost perfectly.\n\n**Conflict Risk: 85%**\nHigh synergy comes with high friction. The Creator/Sage\'s perfectionism will collide with the Hero/Outlaw\'s urgency. The Sage\'s analysis will frustrate the Hero\'s bias toward action. The Creator\'s need for control will clash with the Outlaw\'s need to break things. This conflict is productive — until it isn\'t.\n\n**Longevity: 58%**\nThe statistical reality: this archetype pairing has a median partnership duration of 4-6 years. The breakup usually isn\'t creative — it\'s personal. The Hero/Outlaw\'s intensity eventually burns through the Creator/Sage\'s patience, or the Creator/Sage\'s perfectionism makes the Hero/Outlaw feel creatively suffocated.\n\n**Cultural Impact: 97%**\nWhen this pairing works, it doesn\'t just make good music — it defines eras. The intellectual precision of the Creator/Sage ensures the work ages well, while the Hero/Outlaw\'s rawness ensures it connects immediately. This is the rare partnership capable of both commercial success and critical acclaim.',
    pullQuote: 'The higher the synergy, the higher the stakes.',
  },
  {
    title: 'Division of Creative Labor',
    content:
      '**Songwriting:** Creator/Sage leads melody and harmony; Hero/Outlaw leads lyrics and rhythm. Both contribute to arrangement — this is where productive tension lives.\n\n**Production:** Creator/Sage dominates. This is non-negotiable. The Hero/Outlaw may have strong instincts about energy and dynamics, but the technical execution belongs to the Sage\'s precision.\n\n**Business & Strategy:** Split. The Sage handles contracts, royalties, and long-term planning. The Hero handles negotiations, press, and public-facing advocacy. The Outlaw provides the "walk away" power that makes negotiations work.\n\n**Social Media & Content:** Hero/Outlaw leads. Their natural charisma and willingness to be provocative creates engagement the Creator/Sage\'s measured posts never could. The Creator/Sage provides the behind-the-scenes, process-oriented content that builds depth.\n\n**Live Performance:** Hero/Outlaw dominates the stage. Creator/Sage controls the sound. This is the partnership at its most visible and its most powerful — the audience sees the Hero\'s performance while hearing the Sage\'s architecture.\n\n**Creative Direction:** Shared — but with a protocol. Creator/Sage proposes the concept. Hero/Outlaw stress-tests it by asking "would I die on stage for this?" If both approve, it moves forward. If either vetoes, it\'s shelved.',
    pullQuote: 'The best partnerships don\'t split everything 50/50 — they give 100% where each is strongest.',
  },
  {
    title: 'Danger Zone: The Magnum Opus Trap',
    content:
      '**WARNING: This is the most common failure mode for Creator/Sage × Hero/Outlaw partnerships.**\n\nThe scenario: After initial success, the Creator/Sage becomes obsessed with creating The Definitive Work — the album that synthesizes every idea, reference, and technique into something undeniable. The project scope expands. Timelines extend. The Hero/Outlaw, meanwhile, is losing patience. They need to perform, to release, to stay relevant. They don\'t understand why a 12-track album needs 18 months of refinement.\n\nThe breaking point usually arrives when the Hero/Outlaw threatens to (or actually does) release solo material — which the Creator/Sage interprets as betrayal, and the Hero/Outlaw frames as survival.\n\n**Prevention Protocol:**\n1. Set release schedules in advance and treat them as sacred commitments\n2. Alternate between "big vision" projects and quick-turnaround releases\n3. Give the Hero/Outlaw a solo outlet (live-only tracks, freestyles, features) that doesn\'t compete with the partnership\'s releases\n4. The Creator/Sage must accept that "done" beats "perfect" — every time\n\n**If you\'re already in the trap:** Have a direct conversation about timelines, expectations, and what "good enough" means. Do this before resentment calcifies. The Hero/Outlaw respects directness; the Creator/Sage respects logic. Frame it in both languages.',
    pullQuote: 'The masterpiece that takes forever isn\'t a masterpiece — it\'s a hostage situation.',
  },
  {
    title: 'Joint Artist Manifesto',
    content:
      'We are the tension between thought and action.\n\nOne of us builds worlds with precision and patience. The other charges through them with fire and conviction. We don\'t agree on process, on pace, or on what "ready" means. But we agree on this: the music we make together is something neither of us could create alone.\n\nThe Creator/Sage brings the architecture — the harmonic depth, the structural innovation, the references that reward the thousandth listen. The Hero/Outlaw brings the electricity — the vocal intensity, the stage presence, the refusal to play it safe.\n\nWe will fight. We will frustrate each other. There will be moments where walking away seems easier than working through another creative disagreement. But we know this: the friction between us isn\'t a bug — it\'s the source code.\n\nOur music lives in the space between control and chaos, between intellect and instinct, between the carefully crafted and the recklessly real. We don\'t resolve that tension. We amplify it.\n\nThis is our pact. This is our sound. This is what happens when the architect and the arsonist share a studio.\n\n— Creator/Sage × Hero/Outlaw',
    pullQuote: 'The friction between us isn\'t a bug — it\'s the source code.',
  },
];

/**
 * Returns sections for the given tier.
 */
export function getSectionsForTier(
  tier: 'basic' | 'full' | 'couples',
): ReportSection[] {
  switch (tier) {
    case 'basic':
      return BASIC_SECTIONS;
    case 'full':
      return FULL_SECTIONS;
    case 'couples':
      return COUPLES_SECTIONS;
  }
}
