"use client";

import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useState, useEffect } from "react";
import { ARCHETYPE_DETAILS, Archetype } from "@/lib/archetypes";
import { 
  Star, Download, CheckCircle, ArrowRight, TrendingUp, Target, 
  Users, Briefcase, Camera, Mic, ExternalLink, Crown, Gift
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function PremiumResults() {
  const searchParams = useSearchParams();
  const archetypes = (searchParams?.get("archetypes")?.split(",") || []) as Archetype[];
  const sessionId = searchParams?.get("session_id");
  const [showReveal, setShowReveal] = useState(false);
  const [currentRevealStep, setCurrentRevealStep] = useState(0);
  
  const [primary, secondary, tertiary] = archetypes;
  const primaryDetails = primary ? ARCHETYPE_DETAILS[primary] : null;
  const secondaryDetails = secondary ? ARCHETYPE_DETAILS[secondary] : null;

  useEffect(() => {
    // Animate the reveal sequence
    const timer = setTimeout(() => setShowReveal(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showReveal && currentRevealStep < 4) {
      const timer = setTimeout(() => setCurrentRevealStep(currentRevealStep + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showReveal, currentRevealStep]);

  if (!primary) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-obsidian-black text-alabaster-white">
        <p>No results found. Please take the assessment first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-black text-alabaster-white">
      {/* Premium Header */}
      <div className="py-8 px-6 text-center bg-gradient-to-b from-obsidian-black via-gray-900 to-obsidian-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-teal/10 to-electric-gold/10" />
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-electric-gold" />
            <Badge className="bg-gradient-to-r from-electric-gold to-cyber-teal text-obsidian-black font-bold">
              Premium Report
            </Badge>
            <Crown className="w-6 h-6 text-electric-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-alabaster-white">
            Your Complete Musician Archetype Profile
          </h1>
          <p className="text-cyber-teal text-lg mt-2">
            Personalized Revenue Roadmap & Strategic Analysis
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Animated Archetype Reveal */}
        <AnimatePresence>
          {showReveal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              className="bg-gradient-to-br from-cyber-teal/30 via-electric-gold/20 to-purple-500/30 border border-electric-gold/50 p-8 md:p-12 rounded-3xl mb-12 text-center shadow-2xl relative overflow-hidden"
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-4 left-4 w-20 h-20 bg-cyber-teal/30 rounded-full animate-pulse" />
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-electric-gold/30 rounded-full animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-purple-500/30 rounded-full animate-pulse delay-500" />
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative z-10"
              >
                <Star className="w-16 h-16 text-electric-gold mx-auto mb-6" />
                <h2 className="text-6xl md:text-7xl font-serif font-bold text-alabaster-white mb-4">
                  The {primary}
                </h2>
                <div className="text-2xl text-electric-gold font-semibold mb-6">
                  Your Primary Musician Archetype
                </div>
                
                {secondary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={currentRevealStep >= 1 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="inline-block bg-gray-900/50 px-6 py-3 rounded-xl border border-cyber-teal/30"
                  >
                    <span className="text-lg text-gray-300">Secondary: </span>
                    <span className="text-xl font-bold text-cyber-teal">The {secondary}</span>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Archetype Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={currentRevealStep >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {/* Primary Archetype Deep Dive */}
          <Card className="bg-gradient-to-br from-cyber-teal/20 to-electric-gold/20 border-cyber-teal/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-8 h-8 text-electric-gold" />
                <h3 className="text-2xl font-bold text-alabaster-white">The {primary}</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Badge className="mb-3 bg-cyber-teal/20 text-cyber-teal border-cyber-teal/30">
                    {primaryDetails?.category} Focus
                  </Badge>
                  <p className="text-alabaster-white/90 leading-relaxed">
                    {primaryDetails?.fullDescription || primaryDetails?.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-electric-gold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Your Strengths
                  </h4>
                  <ul className="space-y-2">
                    {primaryDetails?.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-alabaster-white/90">
                        <CheckCircle className="w-4 h-4 text-cyber-teal mt-1 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Strategies */}
          <Card className="bg-gradient-to-br from-electric-gold/20 to-purple-500/20 border-electric-gold/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-8 h-8 text-electric-gold" />
                <h3 className="text-2xl font-bold text-alabaster-white">Revenue Strategies</h3>
              </div>
              
              <div className="space-y-4">
                {primaryDetails?.revenueStrategies.map((strategy, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={currentRevealStep >= 2 ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-electric-gold/20"
                  >
                    <div className="w-6 h-6 bg-electric-gold text-obsidian-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-alabaster-white/90">{strategy}</span>
                  </motion.div>
                ))}
              </div>

              <Separator className="my-6" />

              <div>
                <h4 className="text-lg font-bold text-electric-gold mb-3">Revenue Potential</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-cyber-teal">$2K-10K</div>
                    <div className="text-sm text-gray-400">Monthly (Starting)</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-electric-gold">$25K+</div>
                    <div className="text-sm text-gray-400">Monthly (Established)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={currentRevealStep >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-electric-gold" />
                <h3 className="text-3xl font-bold text-alabaster-white">Your 90-Day Revenue Roadmap</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {primaryDetails?.roadmap?.slice(0, 3).map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={currentRevealStep >= 3 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-cyber-teal/20 to-electric-gold/20 p-6 rounded-xl border border-cyber-teal/30 h-full">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyber-teal to-electric-gold text-obsidian-black rounded-full flex items-center justify-center text-lg font-bold mb-4">
                        {index + 1}
                      </div>
                      <h4 className="text-lg font-bold text-alabaster-white mb-3">
                        {index === 0 ? "Days 1-30" : index === 1 ? "Days 31-60" : "Days 61-90"}
                      </h4>
                      <p className="text-alabaster-white/90 text-sm leading-relaxed">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personalized Strategies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={currentRevealStep >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-electric-gold" />
                <h3 className="text-3xl font-bold text-alabaster-white">Personalized Strategies</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-purple-300 mb-4">Marketing & Branding</h4>
                  <ul className="space-y-3">
                    {primaryDetails?.personalizedStrategies?.slice(0, 3).map((strategy, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                        <span className="text-alabaster-white/90 text-sm">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-purple-300 mb-4">Growth Tactics</h4>
                  <ul className="space-y-3">
                    {primaryDetails?.personalizedStrategies?.slice(3, 6).map((strategy, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                        <span className="text-alabaster-white/90 text-sm">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Secondary Archetype Analysis */}
        {secondary && secondaryDetails && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={currentRevealStep >= 3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-electric-gold/20 to-cyber-teal/20 border-electric-gold/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Mic className="w-8 h-8 text-electric-gold" />
                  <h3 className="text-3xl font-bold text-alabaster-white">
                    Your Secondary Archetype: The {secondary}
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-alabaster-white/90 leading-relaxed mb-6">
                      {secondaryDetails.fullDescription || secondaryDetails.description}
                    </p>
                    
                    <h4 className="text-lg font-bold text-electric-gold mb-3">How This Enhances Your Primary</h4>
                    <p className="text-alabaster-white/80 text-sm leading-relaxed">
                      Your {secondary} secondary adds unique depth to your {primary} foundation. This combination 
                      allows you to access different energy levels and appeal to a broader audience while maintaining 
                      your core identity.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-electric-gold mb-3">Additional Revenue Streams</h4>
                    <ul className="space-y-2">
                      {secondaryDetails.revenueStrategies.slice(0, 3).map((strategy, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-electric-gold mt-1 flex-shrink-0" />
                          <span className="text-alabaster-white/90 text-sm">{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* PDF Download & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={currentRevealStep >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Download Section */}
          <Card className="bg-gradient-to-r from-cyber-teal/20 to-electric-gold/20 border-electric-gold/50">
            <CardContent className="p-8">
              <Download className="w-16 h-16 text-electric-gold mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-alabaster-white mb-4">
                Complete 25-Page PDF Report
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                Your comprehensive Musician Archetype Report includes detailed analysis, specific venue recommendations, 
                networking templates, marketing calendar, and step-by-step implementation guides.
              </p>
              <div className="space-y-4">
                <Button size="lg" className="bg-electric-gold text-obsidian-black font-bold hover:bg-electric-gold/90 text-lg px-8">
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF Report
                </Button>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                  <span>✓ Printable Format</span>
                  <span>✓ Mobile Optimized</span>
                  <span>✓ Lifetime Access</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-alabaster-white mb-6">Ready to Implement?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Button variant="outline" size="lg" className="border-cyber-teal text-cyber-teal hover:bg-cyber-teal hover:text-obsidian-black">
                  Book Strategy Call
                </Button>
                <Button variant="outline" size="lg" className="border-electric-gold text-electric-gold hover:bg-electric-gold hover:text-obsidian-black">
                  Join Mastermind
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cross-promotion */}
          <Card className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-purple-500/30">
            <CardContent className="p-8">
              <Gift className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-alabaster-white mb-4">
                Bonus: Complete Your Profile
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Take our HEXACO Personality Assessment to discover the cognitive patterns and psychological traits 
                that complement your Musician Archetype. Perfect for understanding your creative process and collaboration style.
              </p>
              <Link 
                href="http://localhost:5173" 
                target="_blank"
              >
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Take HEXACO Assessment (Free)
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function PremiumResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-obsidian-black text-electric-gold">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your premium report...</p>
        </div>
      </div>
    }>
      <PremiumResults />
    </Suspense>
  );
}