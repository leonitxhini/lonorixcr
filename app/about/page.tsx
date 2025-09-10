"use client";

import { motion } from 'framer-motion';
import { Crown, Target, Brain, Zap, Mail, Github, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function About() {
  const features = [
    {
      icon: Target,
      title: 'Smart Card Planning',
      description: 'Advanced algorithms analyze your card collection to provide optimal upgrade paths and resource management strategies.',
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Leveraging GPT-4 technology to provide expert-level deck analysis, strategy recommendations, and meta insights.',
    },
    {
      icon: Zap,
      title: 'Real-Time Data',
      description: 'Direct integration with Supercell\'s official Clash Royale API ensures you always have access to the latest player statistics.',
    },
  ];

  const stats = [
    { label: 'Cards Analyzed', value: '100+' },
    { label: 'Player Profiles', value: '50M+' },
    { label: 'Deck Combinations', value: '∞' },
    { label: 'Win Rate Improvement', value: '15%' },
  ];

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="relative inline-block mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-yellow-500/30 rounded-full blur-xl scale-125 -z-10"></div>
            <img 
              src="/crlogo.png" 
              alt="Lonorix CR Logo" 
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mx-auto logo-glow logo-float relative z-10"
            />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold clash-text-gradient mb-3 sm:mb-4">
              About Lonorix CR
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              The ultimate companion for Clash Royale players seeking to optimize their gameplay through data-driven insights and AI-powered strategy recommendations.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="mb-8 sm:mb-12">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 text-center max-w-4xl mx-auto px-4">
                Lonorix CR empowers Clash Royale players of all skill levels to make informed decisions about their card collection and deck composition. 
                By combining official game data with cutting-edge AI analysis, we provide personalized recommendations that help players climb the ladder and dominate the arena.
              </p>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white">
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="card-hover h-full">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-600 mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Built with Modern Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">Next.js 14</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">React Framework</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">TypeScript</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Type Safety</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">OpenAI GPT-4</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">AI Analysis</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">Clash Royale API</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Official Data</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="clash-gradient text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Have questions, suggestions, or want to contribute to Lonorix CR? We'd love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <Github className="h-4 w-4 mr-2" />
                  View on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}