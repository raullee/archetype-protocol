"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense, useState } from "react";
import { ARCHETYPE_DETAILS, Archetype } from "@/lib/archetypes";
import { Lock, Unlock, Star, Download, ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

function Results() {
  const searchParams = useSearchParams();
  const archetypes = (searchParams?.get("archetypes")?.split(",") || []) as Archetype[];
  const isBypass = searchParams?.get("bypass") === "true";
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(isBypass);
  
  const [primary, secondary, tertiary] = archetypes;
  const primaryArchetypeDetails = primary ? ARCHETYPE_DETAILS[primary] : null;
  const secondaryArchetypeDetails = secondary ? ARCHETYPE_DETAILS[secondary] : null;

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ archetypes }),
      });
      const { sessionId } = await response.json();
      
      if (sessionId) {
        // For now, just show success message in test mode
        alert('Checkout would redirect to Stripe here with session: ' + sessionId);
        setIsUnlocking(false);
      } else {
        setIsUnlocking(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsUnlocking(false);
    }
  };

  const handleTestUnlock = () => {
    setIsUnlocked(true);
  };

  if (!primary) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-obsidian-black text-alabaster-white">
        <p>No results found. Please take the assessment first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-black text-alabaster-white">
      {/* Header */}
      <div className="py-8 px-6 text-center bg-gradient-to-b from-obsidian-black to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-cyber-teal text-lg mb-2">🎭 Your Artist Archetype Report</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-alabaster-white">
            Assessment Complete
          </h1>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Primary Archetype - Always Visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-cyber-teal/20 to-electric-gold/20 border border-cyber-teal/30 p-8 rounded-2xl mb-8 text-center shadow-2xl"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-electric-gold" />
            <span className="text-xl text-electric-gold font-semibold">Primary Archetype</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-alabaster-white mb-6">
            The {primary}
          </h2>
          
          <div className="text-left text-alabaster-white/90 text-lg space-y-4 max-w-2xl mx-auto">
            {primaryArchetypeDetails?.description.split('\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">{paragraph}</p>
            ))}
          </div>
          
          {secondary && (
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-electric-gold/20">
              <p className="text-xl text-center">
                <span className="text-gray-300">Secondary Archetype: </span>
                <span className="text-electric-gold font-bold">The {secondary}</span>
              </p>
              <p className="text-gray-400 text-sm mt-2 text-center">
                This combination creates unique strengths and potential conflicts...
              </p>
            </div>
          )}
        </motion.div>

        {/* Paywall or Full Content */}
        {!isUnlocked ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Blurred Preview */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-700">
              <div className="blur-sm bg-gray-900/50 p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-electric-gold mb-4">🎯 Ideal Roles For You</h3>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-electric-gold mb-4">💼 Career Strategy</h3>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-electric-gold mb-4">⚡ Your Archetype Combination Analysis</h3>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/5"></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-electric-gold mb-4">📝 Detailed PDF Report</h3>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
              
              {/* Lock Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-black via-obsidian-black/70 to-transparent flex items-center justify-center">
                <div className="text-center p-8">
                  <Lock className="w-16 h-16 text-electric-gold mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-alabaster-white mb-4">
                    Unlock Your Complete Profile
                  </h3>
                  
                  <div className="space-y-3 text-left max-w-md mx-auto mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-cyber-teal" />
                      <span>Detailed analysis of your {secondary} secondary archetype</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-cyber-teal" />
                      <span>Specific roles and character types to pursue</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-cyber-teal" />
                      <span>Branding strategy and headshot recommendations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-cyber-teal" />
                      <span>Career roadmap and networking guidance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-cyber-teal" />
                      <span>15-page detailed PDF report</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <span className="text-2xl text-gray-400 line-through">$47</span>
                      <span className="text-4xl font-bold text-electric-gold">$9.99</span>
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">79% OFF</span>
                    </div>
                    <p className="text-gray-400 text-sm">Limited time launch pricing</p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUnlock}
                      disabled={isUnlocking}
                      className="bg-gradient-to-r from-electric-gold to-cyber-teal text-obsidian-black font-bold py-4 px-8 rounded-lg text-xl w-full max-w-sm mx-auto flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isUnlocking ? (
                        <>
                          <div className="w-5 h-5 border-2 border-obsidian-black border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Unlock className="w-5 h-5" />
                          Unlock Full Report - $9.99
                        </>
                      )}
                    </motion.button>
                    
                    <button
                      onClick={handleTestUnlock}
                      className="text-gray-400 hover:text-alabaster-white transition-colors text-sm underline"
                    >
                      Free Preview (Test Mode)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Full Unlocked Content */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Secondary Archetype Detail */}
            {secondary && secondaryArchetypeDetails && (
              <div className="bg-gradient-to-br from-electric-gold/20 to-cyber-teal/20 border border-electric-gold/30 p-8 rounded-2xl">
                <h3 className="text-3xl font-bold text-electric-gold mb-6 text-center">
                  Your Secondary Archetype: The {secondary}
                </h3>
                <div className="text-alabaster-white/90 text-lg space-y-4">
                  {secondaryArchetypeDetails.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Archetype Combination Analysis */}
            <div className="bg-gray-900/50 border border-gray-700 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-electric-gold mb-6">⚡ Your Unique Combination Analysis</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-cyber-teal mb-4">Strengths of Your Combination</h4>
                  <ul className="space-y-2 text-alabaster-white/90">
                    <li>• Versatile range allowing for complex character portrayals</li>
                    <li>• Natural authenticity in {primary.toLowerCase()} roles with {secondary?.toLowerCase()} undertones</li>
                    <li>• Ability to surprise casting directors with unexpected depth</li>
                    <li>• Strong emotional range from your dual archetype foundation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-cyber-teal mb-4">Potential Challenges</h4>
                  <ul className="space-y-2 text-alabaster-white/90">
                    <li>• May seem inconsistent if not properly branded</li>
                    <li>• Requires clear positioning to avoid confusion</li>
                    <li>• Need to choose which archetype leads in different contexts</li>
                    <li>• Casting directors may typecast you incorrectly</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Ideal Roles */}
            <div className="bg-gray-900/50 border border-gray-700 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-electric-gold mb-6">🎯 Ideal Roles and Character Types</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-lg font-bold text-cyber-teal mb-3">Film/TV Roles</h4>
                  <ul className="space-y-1 text-alabaster-white/90 text-sm">
                    <li>• Conflicted protagonists</li>
                    <li>• Complex supporting characters</li>
                    <li>• Character-driven indie films</li>
                    <li>• Streaming series leads</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-cyber-teal mb-3">Theater</h4>
                  <ul className="space-y-1 text-alabaster-white/90 text-sm">
                    <li>• Contemporary dramas</li>
                    <li>• Ensemble pieces</li>
                    <li>• Character studies</li>
                    <li>• Experimental theater</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-cyber-teal mb-3">Commercial</h4>
                  <ul className="space-y-1 text-alabaster-white/90 text-sm">
                    <li>• Lifestyle brands</li>
                    <li>• Authentic testimonials</li>
                    <li>• Character-based spots</li>
                    <li>• Narrative commercials</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Career Strategy */}
            <div className="bg-gray-900/50 border border-gray-700 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-electric-gold mb-6">💼 Your Personalized Career Strategy</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-cyber-teal mb-3">Branding Approach</h4>
                  <p className="text-alabaster-white/90 leading-relaxed">
                    Position yourself as "The Thinking {primary}" who brings unexpected {secondary?.toLowerCase()} qualities. 
                    Your headshots should capture both the intensity of your primary archetype and the softer qualities 
                    of your secondary. This dual nature is your competitive advantage.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-cyber-teal mb-3">Networking Strategy</h4>
                  <ul className="space-y-2 text-alabaster-white/90">
                    <li>• Target casting directors who work on character-driven projects</li>
                    <li>• Connect with directors known for complex character development</li>
                    <li>• Join workshops focused on psychological realism</li>
                    <li>• Build relationships with writers who create nuanced characters</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-cyber-teal mb-3">Audition Strategy</h4>
                  <ul className="space-y-2 text-alabaster-white/90">
                    <li>• Lead with your {primary} energy but hint at {secondary} depth</li>
                    <li>• Choose sides that showcase your range within your archetype</li>
                    <li>• Avoid roles that require you to abandon your authentic self</li>
                    <li>• Practice transitions between your two archetype energies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* PDF Download */}
            <div className="bg-gradient-to-r from-cyber-teal/20 to-electric-gold/20 border border-electric-gold/50 p-8 rounded-2xl text-center">
              <Download className="w-16 h-16 text-electric-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-alabaster-white mb-4">Complete 15-Page PDF Report</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Download your comprehensive Artist Archetype Report with detailed analysis, 
                role recommendations, headshot guidelines, and a complete career roadmap.
              </p>
              <button className="bg-electric-gold text-obsidian-black font-bold py-3 px-6 rounded-lg text-lg hover:bg-electric-gold/90 transition-colors flex items-center gap-2 mx-auto">
                <Download className="w-5 h-5" />
                Download PDF Report
              </button>
            </div>
          </motion.div>
        )}

        {/* Cross-promotion to HEXACO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 p-8 rounded-2xl"
        >
          <h3 className="text-2xl font-bold text-alabaster-white mb-4 text-center">
            🧠 Want Even Deeper Personality Insights?
          </h3>
          <p className="text-gray-300 text-center mb-6 max-w-2xl mx-auto">
            Discover your complete personality profile with our HEXACO assessment. 
            Uncover hidden traits, cognitive patterns, and psychological insights that complement your Artist Archetype.
          </p>
          <div className="text-center">
            <Link 
              href="http://localhost:5173" 
              target="_blank"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              Take HEXACO Personality Test
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-obsidian-black text-electric-gold">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Analyzing your artistic personality...</p>
        </div>
      </div>
    }>
      <Results />
    </Suspense>
  );
}