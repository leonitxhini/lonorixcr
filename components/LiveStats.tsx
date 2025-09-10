"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Trophy, Zap } from 'lucide-react';
import { StatsCard } from './StatsCard';

export function LiveStats() {
  const [stats, setStats] = useState({
    activeUsers: 12547,
    decksAnalyzed: 89234,
    avgTrophyGain: 156,
    winRateImprovement: 23.5,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        decksAnalyzed: prev.decksAnalyzed + Math.floor(Math.random() * 5),
        avgTrophyGain: prev.avgTrophyGain + Math.floor(Math.random() * 6) - 3,
        winRateImprovement: prev.winRateImprovement + (Math.random() * 0.2) - 0.1,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        icon={Users}
        title="Active Users"
        value={stats.activeUsers}
        change="+12% from last hour"
        trend="up"
        delay={0}
      />
      <StatsCard
        icon={TrendingUp}
        title="Decks Analyzed"
        value={stats.decksAnalyzed}
        change="+5 in last minute"
        trend="up"
        delay={0.1}
      />
      <StatsCard
        icon={Trophy}
        title="Avg Trophy Gain"
        value={stats.avgTrophyGain}
        change="+8% this week"
        trend="up"
        delay={0.2}
      />
      <StatsCard
        icon={Zap}
        title="Win Rate Boost"
        value={`${stats.winRateImprovement.toFixed(1)}%`}
        change="+2.1% this month"
        trend="up"
        delay={0.3}
      />
    </div>
  );
}