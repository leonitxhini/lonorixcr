"use client";

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export function StatsCard({ icon: Icon, title, value, change, trend = 'neutral', delay = 0 }: StatsCardProps) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="card-hover glass dark:glass-dark border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-yellow-500/10" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value.toLocaleString()}</p>
              {change && (
                <p className={`text-xs ${trendColors[trend]} flex items-center gap-1`}>
                  {change}
                </p>
              )}
            </div>
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-yellow-500">
              {title === "Player Level" ? (
                <img 
                  src="/Design ohne Titel (16).png" 
                  alt="Logo" 
                  className="h-6 w-6"
                />
              ) : (
                <Icon className="h-6 w-6 text-white" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}