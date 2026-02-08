"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { CheckCircle, Download, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const archetypes = searchParams?.get("archetypes")?.split(",") || [];
  const [primary, secondary] = archetypes;

  return (
    <div className="min-h-screen bg-obsidian-black text-alabaster-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyber-teal to-electric-gold rounded-full mb-8 shadow-2xl shadow-cyber-teal/50"
          >
            <CheckCircle className="w-12 h-12 text-obsidian-black" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-electric-gold via-cyber-teal to-electric-gold bg-clip-text text-transparent">
            Welcome to Your Journey!
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your payment has been confirmed. You now have full access to your 
            <span className="text-cyber-teal font-semibold"> {primary}/{secondary}</span> archetype report
            and all premium insights.
          </p>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-gradient-to-br from-cyber-teal/20 to-electric-gold/20 border-cyber-teal/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-cyber-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-obsidian-black font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-bold text-cyber-teal mb-2">View Full Report</h3>
              <p className="text-gray-300 text-sm">
                Access your complete archetype analysis with detailed insights and strategies
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-electric-gold/20 to-cyber-teal/20 border-electric-gold/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-electric-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-obsidian-black font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-bold text-electric-gold mb-2">Download PDF</h3>
              <p className="text-gray-300 text-sm">
                Get your 15-page detailed report with career roadmap and branding guide
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-bold text-purple-400 mb-2">Take HEXACO</h3>
              <p className="text-gray-300 text-sm">
                Complement with our personality assessment for deeper insights
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="space-y-4">
            <Link href={`/results?archetypes=${archetypes.join(",")}&payment=success`}>
              <Button className="bg-gradient-to-r from-cyber-teal to-electric-gold text-obsidian-black font-bold py-4 px-8 text-lg hover:scale-105 transition-transform">
                <Star className="w-5 h-5 mr-2" />
                View Your Complete Report
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <div className="flex gap-4 justify-center">
              <Link href="https://hexaco-test-app.vercel.app" target="_blank">
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                  Take HEXACO Test
                </Button>
              </Link>
              
              <Link href="https://social-scheduler.vercel.app" target="_blank">
                <Button variant="outline" className="border-indigo-500 text-indigo-400 hover:bg-indigo-500/10">
                  Social Scheduler
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Confirmation Details */}
          <Card className="bg-gray-900/50 border-gray-700 max-w-md mx-auto">
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-center mb-4">Purchase Confirmation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Product:</span>
                  <span>Artist Archetype Report</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Archetype:</span>
                  <span className="text-cyber-teal">{primary}/{secondary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-electric-gold font-bold">$19.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">✓ Paid</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-obsidian-black text-electric-gold">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Processing your purchase...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}