// Cross-product integration utilities (Archetype Protocol side)

export interface UserProfile {
  hexacoScores?: Record<string, { score: number; facets: Record<string, number> }>;
  primaryArchetype?: string;
  secondaryArchetype?: string;
  completedHexaco: boolean;
  completedArchetype: boolean;
  email?: string;
  completedAt?: number;
}

export const getUserProfile = (): UserProfile => {
  if (typeof window === 'undefined') {
    return {
      completedHexaco: false,
      completedArchetype: false
    };
  }

  try {
    // Check HEXACO completion
    const hexacoResults = localStorage.getItem('hexaco_results');
    const hexacoCompleted = localStorage.getItem('hexaco_completed');
    
    // Check Archetype completion  
    const archetypeResults = localStorage.getItem('archetype_results');
    const archetypeCompleted = localStorage.getItem('archetype_completed');
    
    // Parse stored data
    let hexacoScores: Record<string, { score: number; facets: Record<string, number> }> | undefined;
    let primaryArchetype: string | undefined;
    let secondaryArchetype: string | undefined;

    if (hexacoResults) {
      try {
        hexacoScores = JSON.parse(hexacoResults);
      } catch (e) {
        console.warn('Failed to parse HEXACO results:', e);
      }
    }

    if (archetypeResults) {
      try {
        const parsed = JSON.parse(archetypeResults);
        primaryArchetype = parsed.primary;
        secondaryArchetype = parsed.secondary;
      } catch (e) {
        console.warn('Failed to parse archetype results:', e);
      }
    }

    const email = localStorage.getItem('musician_email') || undefined;

    return {
      hexacoScores,
      primaryArchetype,
      secondaryArchetype,
      completedHexaco: !!hexacoCompleted,
      completedArchetype: !!archetypeCompleted,
      email,
      completedAt: Math.max(
        parseInt(hexacoCompleted || '0', 10),
        parseInt(archetypeCompleted || '0', 10)
      )
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      completedHexaco: false,
      completedArchetype: false
    };
  }
};

export const saveArchetypeResults = (primary: string, secondary?: string) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('archetype_results', JSON.stringify({ primary, secondary }));
    localStorage.setItem('archetype_completed', Date.now().toString());
    
    // Track completion for Meta Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration', {
        content_category: 'archetype_test',
        content_name: 'Archetype_Complete'
      });
    }
  } catch (error) {
    console.error('Error saving archetype results:', error);
  }
};

export const getPersonalizedGreeting = (): string | null => {
  const profile = getUserProfile();
  
  if (profile.completedHexaco && profile.hexacoScores) {
    const topTrait = Object.entries(profile.hexacoScores)
      .sort(([,a], [,b]) => b.score - a.score)[0]?.[0];
    return `Welcome back! Ready to discover how your ${topTrait} traits shape your archetype?`;
  }
  
  if (profile.completedArchetype && profile.primaryArchetype) {
    return `Welcome back, ${profile.primaryArchetype}`;
  }
  
  return null;
};

export const shouldShowHexacoCTA = (): { show: boolean; message: string; tier: string } => {
  const profile = getUserProfile();
  
  if (!profile.completedHexaco && profile.completedArchetype && profile.primaryArchetype) {
    return {
      show: true,
      message: `You know you're The ${profile.primaryArchetype}. Get scientific precision with the HEXACO personality test designed for musicians.`,
      tier: 'dual' // Suggest the dual bundle since they already have archetype
    };
  }
  
  return {
    show: false,
    message: '',
    tier: 'basic'
  };
};

export const getCombinedInsights = (): string | null => {
  const profile = getUserProfile();
  
  if (!profile.completedHexaco || !profile.completedArchetype || 
      !profile.hexacoScores || !profile.primaryArchetype) {
    return null;
  }

  const topTrait = Object.entries(profile.hexacoScores)
    .sort(([,a], [,b]) => b.score - a.score)[0]?.[0];
    
  if (!topTrait) return null;

  // Generate combined insights based on archetype + HEXACO combination
  const combinations: Record<string, Record<string, string>> = {
    Creator: {
      'Openness to Experience': "Your Creator archetype + high Openness creates an unstoppable creative force, but watch for perfectionism paralysis",
      'Conscientiousness': "Your Creator soul with Conscientiousness gives you the rare ability to both envision AND execute your artistic vision",
      'Extraversion': "Creator + Extraversion means you create best in collaboration and thrive on audience feedback"
    },
    Hero: {
      'Conscientiousness': "Hero archetype + high Conscientiousness makes you unstoppable in pursuing your artistic mission",
      'Honesty-Humility': "Your Hero nature tempered by Honesty-Humility means you fight for others, not your own ego",
      'Extraversion': "Hero + Extraversion creates natural stage presence and the ability to rally audiences to your cause"
    },
    Sage: {
      'Openness to Experience': "Sage + Openness means your music explores ideas others haven't even thought of yet",
      'Conscientiousness': "Your Sage wisdom with methodical Conscientiousness creates deeply researched, intentional art",
      'Honesty-Humility': "Sage + Honesty-Humility: You seek truth in your art, not fame or validation"
    },
    Ruler: {
      'Conscientiousness': "Ruler + Conscientiousness: You build musical empires through systematic excellence",
      'Extraversion': "Ruler archetype + Extraversion creates commanding stage presence and natural band leadership",
      'Honesty-Humility': "Your Ruler leadership balanced by Honesty-Humility means you elevate others while achieving your vision"
    },
    Explorer: {
      'Openness to Experience': "Explorer + Openness: You're constantly pushing musical boundaries and genre conventions",
      'Extraversion': "Explorer archetype + Extraversion means you thrive on diverse collaborations and musical adventures",
      'Agreeableness': "Your Explorer spirit tempered by Agreeableness makes you inclusive in your musical journey"
    },
    Magician: {
      'Openness to Experience': "Magician + Openness: You transform the ordinary into transcendent musical experiences",
      'Extraversion': "Magician archetype + Extraversion creates mesmerizing stage presence and audience transformation",
      'Conscientiousness': "Your Magician vision with methodical Conscientiousness turns musical dreams into reality"
    },
    Outlaw: {
      'Honesty-Humility': "Outlaw + Honesty-Humility: You rebel for truth, not just shock value",
      'Openness to Experience': "Outlaw archetype + Openness means you consistently challenge musical and social norms",
      'Extraversion': "Your Outlaw energy + Extraversion creates revolutionary performances that ignite social change"
    },
    Caregiver: {
      'Agreeableness': "Caregiver + Agreeableness: Your music heals and nurtures audiences at the deepest level",
      'Emotionality': "Caregiver archetype + Emotionality creates profound emotional connection through your art",
      'Honesty-Humility': "Your Caregiver nature with Honesty-Humility means you serve the music, not your ego"
    },
    Lover: {
      'Emotionality': "Lover + Emotionality: You channel raw passion into music that moves hearts and souls",
      'Openness to Experience': "Lover archetype + Openness creates art that explores the full spectrum of human connection",
      'Extraversion': "Your Lover intensity + Extraversion creates intimate connections even in large venues"
    },
    Jester: {
      'Extraversion': "Jester + Extraversion: You use humor and music to create joy and social connection",
      'Openness to Experience': "Jester archetype + Openness means you blend genres and styles in unexpectedly brilliant ways",
      'Agreeableness': "Your Jester spirit with Agreeableness creates inclusive, uplifting musical experiences"
    },
    Innocent: {
      'Honesty-Humility': "Innocent + Honesty-Humility: Your authenticity creates trust and hope through music",
      'Agreeableness': "Innocent archetype + Agreeableness makes your music a safe haven for listeners",
      'Openness to Experience': "Your Innocent wonder + Openness discovers beauty in unexpected musical places"
    },
    Everyman: {
      'Agreeableness': "Everyman + Agreeableness: You create music that makes everyone feel like they belong",
      'Honesty-Humility': "Everyman archetype + Honesty-Humility means your relatable music comes from genuine experience",
      'Conscientiousness': "Your Everyman relatability with Conscientiousness creates consistently solid, dependable artistry"
    }
  };

  const insight = combinations[profile.primaryArchetype]?.[topTrait];
  return insight || `Your ${profile.primaryArchetype} archetype combined with high ${topTrait} creates a unique artistic perspective that no one else can replicate.`;
};