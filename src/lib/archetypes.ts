export type Archetype =
  | "The Virtuoso"
  | "The Hustler"
  | "The Visionary"
  | "The Collaborator"
  | "The Performer"
  | "The Producer";

export const ARCHETYPE_DETAILS: Record<
  Archetype,
  {
    category: "Technical" | "Business" | "Creative";
    description: string;
    strengths: string[];
    revenueStrategies: string[];
    fullDescription?: string;
    personalizedStrategies?: string[];
    roadmap?: string[];
  }
> = {
  // Technical Mastery
  "The Virtuoso": {
    category: "Technical",
    description: "You are the master of your craft. Technical excellence and musical precision define your approach to everything you do.",
    strengths: [
      "Unparalleled technical skill",
      "Dedication to practice and improvement", 
      "Ability to execute complex musical ideas",
      "Respected by peers for expertise"
    ],
    revenueStrategies: [
      "Teaching masterclasses and private lessons",
      "Session musician work for high-end projects",
      "Licensing complex compositions for media"
    ],
    fullDescription: "The Virtuoso represents the pinnacle of musical craftsmanship. You've spent thousands of hours honing your technique, and it shows in every note you play. Your precision is legendary, and other musicians look up to you as the gold standard in your field. You don't just play music—you elevate it to an art form through sheer technical mastery. Your pursuit of perfection drives everything you do, and you have little tolerance for mediocrity. While others chase trends, you chase excellence. Your music speaks the universal language of skill that transcends genres and generations.",
    personalizedStrategies: [
      "Position yourself as the premium option in your niche",
      "Create educational content that showcases your expertise",
      "Partner with high-end brands that value craftsmanship",
      "Offer exclusive, high-value experiences for dedicated students",
      "Build a waiting list for your services to create scarcity"
    ],
    roadmap: [
      "Launch a signature masterclass series ($497-$997 per course)",
      "Develop a premium mentorship program ($2000-5000/month)",
      "Create method books and sheet music for passive income",
      "Partner with instrument manufacturers for endorsements",
      "Offer VIP recording session experiences"
    ]
  },
  "The Producer": {
    category: "Technical", 
    description: "You're the sonic architect. You hear the full picture and know how to bring musical visions to life through technology and arrangement.",
    strengths: [
      "Deep understanding of sound engineering",
      "Ability to enhance any musical idea",
      "Technical knowledge of recording/mixing",
      "Talent for bringing out the best in artists"
    ],
    revenueStrategies: [
      "Producing albums for emerging and established artists",
      "Creating beats and instrumentals for licensing",
      "Offering mixing and mastering services"
    ],
    fullDescription: "As The Producer, you possess the rare ability to hear what music could become, not just what it is. You're the sonic sculptor who takes raw musical material and transforms it into polished gems. Your studio is your laboratory, where you experiment with sounds, textures, and arrangements until they achieve their full potential. You understand that great production can make or break a song, and artists trust you to elevate their vision. You're equally comfortable with cutting-edge technology and vintage gear, knowing that the best tools are the ones that serve the music. Your role is part technician, part artist, and part psychologist.",
    personalizedStrategies: [
      "Specialize in a signature sound that artists seek out",
      "Create production templates and sample packs for sale",
      "Offer remote production services to global market",
      "Build relationships with A&Rs and music supervisors",
      "Develop a production collective with other top producers"
    ],
    roadmap: [
      "Establish premium day rates for studio sessions ($500-2000/day)",
      "Launch online production courses and tutorials",
      "Create and sell signature sample libraries",
      "Secure retainer deals with labels or management companies",
      "Build a state-of-the-art facility for rental income"
    ]
  },

  // Business Focused
  "The Hustler": {
    category: "Business",
    description: "You understand that music is both art and business. You're driven, strategic, and always looking for the next opportunity.",
    strengths: [
      "Natural entrepreneurial instincts",
      "Strong networking and relationship building",
      "Understanding of music industry mechanics",
      "Ability to spot and create opportunities"
    ],
    revenueStrategies: [
      "Building multiple income streams simultaneously",
      "Leveraging social media for brand partnerships",
      "Creating scalable online music businesses"
    ],
    fullDescription: "The Hustler knows that talent alone isn't enough—you need strategy, persistence, and business acumen to succeed in music. You're constantly thinking three steps ahead, identifying opportunities that others miss. While some musicians wait to be discovered, you create your own opportunities. You understand that every interaction is potentially valuable, every platform is a potential revenue stream, and every challenge is a chance to innovate. You're not afraid to get your hands dirty with the business side because you know it's what separates the dreamers from the achievers. Your music career is built on smart decisions, not just good songs.",
    personalizedStrategies: [
      "Diversify income across performance, licensing, merch, and digital products",
      "Build an email list and convert followers into paying customers", 
      "Create exclusive content and experiences for different price points",
      "Network strategically with industry decision-makers",
      "Always test new revenue streams and scale what works"
    ],
    roadmap: [
      "Launch a subscription-based fan membership program",
      "Develop merchandise lines with strong profit margins",
      "Create digital products like courses or sample packs",
      "Secure brand partnerships and sponsorship deals",
      "Build a team to handle operations while you focus on growth"
    ]
  },

  // Creative Vision
  "The Visionary": {
    category: "Creative",
    description: "You see the future of music. Your creativity knows no bounds, and you're constantly pushing artistic boundaries.",
    strengths: [
      "Innovative artistic vision", 
      "Ability to blend genres and styles",
      "Natural trendsetting abilities",
      "Deep emotional connection to music creation"
    ],
    revenueStrategies: [
      "Creating groundbreaking albums that define new genres",
      "Licensing unique compositions for film and media",
      "Developing signature artistic experiences"
    ],
    fullDescription: "As The Visionary, you don't just make music—you channel the future through your art. You see connections that others miss, blend influences in ways that shouldn't work but somehow do, and create sounds that feel both completely new and strangely familiar. Your music often challenges listeners initially, but eventually becomes the blueprint others follow. You're not interested in copying what's already been done; you're compelled to explore uncharted territory. Your artistic integrity is non-negotiable, and you'd rather fail pursuing your vision than succeed copying someone else's. You understand that true innovation requires risk.",
    personalizedStrategies: [
      "Document your creative process to build mystique and value",
      "Partner with forward-thinking brands that align with your vision",
      "Create immersive experiences that go beyond traditional concerts",
      "License your innovative work to media projects seeking uniqueness",
      "Build a cult following that values artistic authenticity"
    ],
    roadmap: [
      "Develop a signature artistic concept or world",
      "Create limited-edition releases with premium packaging",
      "Partner with visual artists for multimedia experiences",
      "Secure placements in avant-garde films and games",
      "Launch an artistic collective or record label"
    ]
  },
  "The Collaborator": {
    category: "Creative",
    description: "Music is a conversation for you. You bring out the best in others and create magic through creative partnerships.",
    strengths: [
      "Exceptional interpersonal skills",
      "Ability to adapt to different musical styles",
      "Talent for facilitating creative breakthroughs", 
      "Strong reputation for being easy to work with"
    ],
    revenueStrategies: [
      "Co-writing with established and emerging artists",
      "Facilitating high-value collaboration sessions",
      "Building long-term creative partnerships"
    ],
    fullDescription: "The Collaborator understands that the whole can be greater than the sum of its parts. You have a gift for bringing out the best in other musicians, creating an environment where everyone's strengths shine. You're the musical diplomat who can navigate different personalities, styles, and egos to create something beautiful together. Your network is your greatest asset because people love working with you. You don't need to be the star to be successful—you make the stars around you shine brighter. Your music often has a warmth and chemistry that's hard to replicate because it comes from genuine human connection.",
    personalizedStrategies: [
      "Build a reputation as the go-to collaborator in your scene",
      "Create co-writing retreats or collaboration events",
      "Offer your facilitation skills to labels and management companies",
      "Document successful collaborations for case studies",
      "Maintain relationships across different musical communities"
    ],
    roadmap: [
      "Establish co-writing splits with successful artists",
      "Launch a collaboration facilitation service",
      "Create exclusive songwriter camps or retreats",
      "Build publishing income through collaborative works",
      "Develop a signature process for successful collaborations"
    ]
  },

  // Performance Energy  
  "The Performer": {
    category: "Creative",
    description: "The stage is your natural habitat. You live to connect with audiences and create unforgettable live experiences.",
    strengths: [
      "Magnetic stage presence",
      "Natural ability to read and energize crowds",
      "Confidence in live performance situations",
      "Skill at creating memorable experiences"
    ],
    revenueStrategies: [
      "Headlining festivals and premium venues",
      "Creating exclusive live experiences and private shows",
      "Building massive streaming numbers through live content"
    ],
    fullDescription: "For The Performer, music isn't truly alive until it meets an audience. You understand that a song on recording is just the blueprint—the real magic happens when you bring it to life on stage. You have an intuitive understanding of crowd dynamics and can adjust your energy to match any room. Whether it's an intimate acoustic set or a massive festival stage, you know how to create moments that people will remember forever. Your charisma is your superpower, and you use it to create genuine connections with hundreds or thousands of people at once. The stage isn't just where you work—it's where you come alive.",
    personalizedStrategies: [
      "Focus on creating signature moments in your performances",
      "Build anticipation for live shows through exclusive content",
      "Offer VIP experiences that justify premium pricing",
      "Document your live performances for additional content streams",
      "Create different show formats for different venue types"
    ],
    roadmap: [
      "Develop signature performance concepts and stage productions",
      "Build a touring business with strong profit margins", 
      "Create exclusive acoustic/intimate performance offerings",
      "Launch live streaming concerts for global audiences",
      "Develop performance coaching or workshop offerings"
    ]
  }
};