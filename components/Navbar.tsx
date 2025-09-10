"use client";

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, Home, Calendar, Brain, Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Card Planner', href: '/card-planner', icon: Calendar },
    { name: 'AI Deck Coach', href: '/deck-coach', icon: Brain },
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark backdrop-blur-md border-b border-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 relative">
          {/* Theme Toggle - Left */}
          <div className="absolute left-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="cr-button cr-glow hover:scale-110 transition-all duration-300"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>

          {/* Centered Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center space-x-8"
          >
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 hover:neon-blue px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group cr-hover-lift"
                  >
                    <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="hidden sm:block">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mobile menu button - Right */}
          <div className="absolute right-0 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="cr-button cr-glow hover:scale-110 transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden glass-dark border-b border-blue-500/30"
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-blue-400 hover:neon-blue hover:bg-blue-900/20 transition-all duration-300 cr-hover-lift"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </nav>
  );
}