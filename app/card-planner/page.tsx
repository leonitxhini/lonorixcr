"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Search, User, Trophy, Star, TrendingUp, Zap, Crown, Target, BarChart3, Filter, SortAsc, Eye, Sparkles, Award, Shield, Sword, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CardCollection } from '@/components/CardCollection';
import { StatsCard } from '@/components/StatsCard';

interface PlayerData {
  name: string;
  tag: string;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  cards: Array<{
    name: string;
    level: number;
    maxLevel: number;
    rarity: string;
  }>;
}

export default function CardPlanner() {
  const [playerTag, setPlayerTag] = useState('');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [filterRarity, setFilterRarity] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  const [minLevel, setMinLevel] = useState([1]);
  const [showMaxed, setShowMaxed] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (!playerTag.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Clean the player tag
      const cleanTag = playerTag.replace('#', '').trim();
      console.log('Searching for player:', cleanTag);
      
      const response = await fetch(`/api/player/${cleanTag}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) {
          throw new Error('Player not found. Please check the player tag and try again.');
        }
        if (response.status === 403) {
          throw new Error('API access denied. Please check if the Clash Royale API is properly configured.');
        }
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        }
        throw new Error(errorData.error || `API Error ${response.status}: ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('Player data received:', data);
      
      // Validate that we have the required data structure
      if (!data.name || !data.tag || !Array.isArray(data.cards)) {
        throw new Error('Invalid player data received from API');
      }
      
      const transformedData: PlayerData = {
        name: data.name,
        tag: data.tag,
        expLevel: data.expLevel,
        trophies: data.trophies,
        bestTrophies: data.bestTrophies,
        cards: data.cards.map((card: any) => ({
          name: card.name,
          level: card.level,
          maxLevel: card.maxLevel,
          rarity: card.rarity?.toLowerCase() || 'common',
        })),
      };
      
      setPlayerData(transformedData);
      toast.success(`✅ Player ${data.name} loaded successfully!`);
    } catch (err) {
      console.error('Player search error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to fetch player data: ${errorMessage}`);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getUpgradePriority = (cards: PlayerData['cards']) => {
    return [...cards]
      .filter(card => {
        const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRarity = filterRarity === 'all' || card.rarity === filterRarity;
        const matchesLevel = card.level >= minLevel[0];
        const matchesMaxed = showMaxed || card.level < card.maxLevel;
        return matchesSearch && matchesRarity && matchesLevel && matchesMaxed;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'level':
            return b.level - a.level;
          case 'rarity':
            const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
            return rarityOrder[b.rarity as keyof typeof rarityOrder] - rarityOrder[a.rarity as keyof typeof rarityOrder];
          case 'progress':
          default:
            const aProgress = (a.level / a.maxLevel) * 100;
            const bProgress = (b.level / b.maxLevel) * 100;
            return aProgress - bProgress;
        }
      });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-orange-400 to-orange-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return Shield;
      case 'rare': return Sword;
      case 'epic': return Crown;
      case 'legendary': return Gem;
      default: return Shield;
    }
  };

  const getCollectionStats = () => {
    if (!playerData) return null;
    
    const stats = {
      total: playerData.cards.length,
      maxed: playerData.cards.filter(card => card.level === card.maxLevel).length,
      common: playerData.cards.filter(card => card.rarity === 'common').length,
      rare: playerData.cards.filter(card => card.rarity === 'rare').length,
      epic: playerData.cards.filter(card => card.rarity === 'epic').length,
      legendary: playerData.cards.filter(card => card.rarity === 'legendary').length,
    };
    
    return stats;
  };

  const mockCardData = playerData?.cards.map(card => ({
    ...card,
    count: Math.floor(Math.random() * 1000) + 50,
    requiredForUpgrade: Math.floor(Math.random() * 200) + 20,
  })) || [];

  const stats = getCollectionStats();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.1),transparent_50%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="inline-block mb-6 sm:mb-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-yellow-500/30 rounded-full blur-2xl scale-150 -z-10 animate-pulse"></div>
              <img 
                src="/Design ohne Titel (16).png" 
                alt="RoyaleCoach Logo" 
                className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 mx-auto drop-shadow-2xl logo-glow logo-hover logo-float relative z-10"
              />
            </motion.div>
            
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Lonorix CR - Card Planner
            </motion.h1>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              AI-powered card collection analysis with{' '}
              <span className="text-blue-400 font-semibold">smart upgrade recommendations</span>
            </motion.p>
          </motion.div>

          {/* Advanced Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Card className="mb-6 sm:mb-8 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-blue-500/30 shadow-2xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Player Search & Analysis
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="relative group">
                      <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5 group-focus-within:text-blue-400 transition-colors" />
                      <Input
                        placeholder="Enter player tag (e.g., #2PP or 2PP)"
                        value={playerTag}
                        onChange={(e) => setPlayerTag(e.target.value)}
                        className="cr-input pl-10 sm:pl-12 h-12 sm:h-14 bg-slate-800/50 border-slate-600 focus:border-blue-500 text-white placeholder-gray-400 text-base sm:text-lg"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSearch} 
                    disabled={loading} 
                    className="cr-button h-12 sm:h-14 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cr-glow"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.div>
                    ) : (
                      <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                    <span className="hidden sm:inline">{loading ? 'Searching...' : 'Analyze Player'}</span>
                    <span className="sm:hidden">{loading ? 'Search...' : 'Search'}</span>
                  </Button>
                </div>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-400 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      {error}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Player Dashboard */}
          {playerData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Player Header Card */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-blue-500/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-yellow-500/10" />
                <CardContent className="p-8 relative z-10">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0] 
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                        className="relative"
                      >
                        <img 
                          src="/Design ohne Titel (16).png" 
                          alt="Player Avatar" 
                          className="h-24 w-24 rounded-full border-4 border-blue-500 shadow-lg logo-glow"
                        />
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-2">
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                      </motion.div>
                    </div>
                    
                    <div className="flex-1 text-center lg:text-left">
                      <h2 className="text-4xl font-bold text-white mb-2">{playerData.name}</h2>
                      <p className="text-xl text-blue-400 mb-4">{playerData.tag}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-gray-400">Level</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{playerData.expLevel}</p>
                        </div>
                        
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-400">Trophies</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{playerData.trophies.toLocaleString()}</p>
                        </div>
                        
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="h-4 w-4 text-purple-400" />
                            <span className="text-sm text-gray-400">Best</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{playerData.bestTrophies.toLocaleString()}</p>
                        </div>
                        
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                          <div className="flex items-center gap-2 mb-1">
                            <BarChart3 className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-gray-400">Cards</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{playerData.cards.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-600 p-1">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="collection"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Collection
                  </TabsTrigger>
                  <TabsTrigger 
                    value="upgrades"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Upgrades
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-gray-500/30 rounded-xl p-6 text-center"
                      >
                        <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-full p-3 w-fit mx-auto mb-4">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stats.common}</p>
                        <p className="text-gray-400">Common Cards</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6 text-center"
                      >
                        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-full p-3 w-fit mx-auto mb-4">
                          <Sword className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stats.rare}</p>
                        <p className="text-gray-400">Rare Cards</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 text-center"
                      >
                        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-full p-3 w-fit mx-auto mb-4">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stats.epic}</p>
                        <p className="text-gray-400">Epic Cards</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6 text-center"
                      >
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-3 w-fit mx-auto mb-4 animate-pulse">
                          <Gem className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stats.legendary}</p>
                        <p className="text-gray-400">Legendary Cards</p>
                      </motion.div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
                      <CardContent className="p-6 text-center">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-4 w-fit mx-auto mb-4">
                          <Star className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-2">{stats?.maxed || 0}</p>
                        <p className="text-green-400 font-medium">Maxed Cards</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {stats ? Math.round((stats.maxed / stats.total) * 100) : 0}% Complete
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
                      <CardContent className="p-6 text-center">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full p-4 w-fit mx-auto mb-4">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-2">
                          {stats ? stats.total - stats.maxed : 0}
                        </p>
                        <p className="text-blue-400 font-medium">Upgradeable</p>
                        <p className="text-sm text-gray-400 mt-1">Ready for improvement</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
                      <CardContent className="p-6 text-center">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-4 w-fit mx-auto mb-4">
                          <Zap className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-2">
                          {playerData ? Math.round(playerData.cards.reduce((acc, card) => acc + (card.level / card.maxLevel), 0) / playerData.cards.length * 100) : 0}%
                        </p>
                        <p className="text-purple-400 font-medium">Avg Progress</p>
                        <p className="text-sm text-gray-400 mt-1">Collection strength</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Collection Tab */}
                <TabsContent value="collection" className="space-y-6">
                  {/* Advanced Filters */}
                  <Card className="bg-slate-800/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Filter className="h-5 w-5 text-blue-400" />
                        Advanced Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">Search Cards</label>
                          <Input
                            placeholder="Card name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">Rarity</label>
                          <Select value={filterRarity} onValueChange={setFilterRarity}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="all">All Rarities</SelectItem>
                              <SelectItem value="common">Common</SelectItem>
                              <SelectItem value="rare">Rare</SelectItem>
                              <SelectItem value="epic">Epic</SelectItem>
                              <SelectItem value="legendary">Legendary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">Sort By</label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="progress">Progress</SelectItem>
                              <SelectItem value="name">Name</SelectItem>
                              <SelectItem value="level">Level</SelectItem>
                              <SelectItem value="rarity">Rarity</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={showMaxed}
                            onCheckedChange={setShowMaxed}
                            className="data-[state=checked]:bg-blue-600"
                          />
                          <label className="text-sm font-medium text-gray-300">Show Maxed</label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Minimum Level: {minLevel[0]}
                        </label>
                        <Slider
                          value={minLevel}
                          onValueChange={setMinLevel}
                          max={14}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                      {getUpgradePriority(playerData.cards).map((card, index) => {
                        const progress = (card.level / card.maxLevel) * 100;
                        const RarityIcon = getRarityIcon(card.rarity);
                        
                        return (
                          <motion.div
                            key={card.name}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            layout
                          >
                            <Card className={`bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border-2 border-transparent hover:border-blue-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group`}>
                              <div className={`absolute inset-0 bg-gradient-to-br ${card.rarity === 'common' ? 'from-gray-400 to-gray-600' : card.rarity === 'rare' ? 'from-orange-400 to-orange-600' : card.rarity === 'epic' ? 'from-purple-400 to-purple-600' : 'from-yellow-400 to-yellow-600'} opacity-10 group-hover:opacity-20 transition-opacity`} />
                              
                              <CardContent className="p-6 relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <h3 className="font-bold text-white text-lg mb-1 truncate">{card.name}</h3>
                                    <div className="flex items-center gap-2">
                                      <RarityIcon className="h-4 w-4 text-gray-400" />
                                      <span className="text-sm text-gray-400 capitalize">{card.rarity}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-white">{card.level}</p>
                                    <p className="text-sm text-gray-400">/ {card.maxLevel}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-300">Progress</span>
                                    <span className="text-blue-400 font-medium">{Math.round(progress)}%</span>
                                  </div>
                                  
                                  <div className="relative">
                                    <Progress 
                                      value={progress} 
                                      className="h-3 bg-slate-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  
                                  {card.level < card.maxLevel && (
                                    <Button 
                                      size="sm" 
                                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0"
                                    >
                                      <TrendingUp className="h-4 w-4 mr-2" />
                                      Upgrade Priority
                                    </Button>
                                  )}
                                  
                                  {card.level === card.maxLevel && (
                                    <div className="flex items-center justify-center gap-2 py-2 bg-green-500/20 rounded-lg">
                                      <Star className="h-4 w-4 text-green-400" />
                                      <span className="text-green-400 font-medium">Maxed</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </TabsContent>

                {/* Upgrades Tab */}
                <TabsContent value="upgrades" className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                        Smart Upgrade Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getUpgradePriority(playerData.cards).slice(0, 10).map((card, index) => {
                          const progress = (card.level / card.maxLevel) * 100;
                          const priority = progress < 30 ? 'High' : progress < 70 ? 'Medium' : 'Low';
                          const priorityColor = priority === 'High' ? 'red' : priority === 'Medium' ? 'yellow' : 'green';
                          
                          return (
                            <motion.div
                              key={card.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <Badge className={`${priorityColor === 'red' ? 'bg-red-500' : priorityColor === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'} text-white font-bold px-3 py-1`}>
                                  #{index + 1}
                                </Badge>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-white truncate">{card.name}</p>
                                  <p className="text-sm text-gray-400">
                                    Level {card.level}/{card.maxLevel} • {card.rarity}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="w-32">
                                <Progress value={progress} className="h-3" />
                                <p className="text-xs text-center mt-1 font-medium text-gray-300">
                                  {Math.round(progress)}%
                                </p>
                              </div>
                              
                              <Badge variant="outline" className={`${priorityColor === 'red' ? 'text-red-400 border-red-400' : priorityColor === 'yellow' ? 'text-yellow-400 border-yellow-400' : 'text-green-400 border-green-400'}`}>
                                {priority}
                              </Badge>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-slate-800/50 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-white">Collection Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {['common', 'rare', 'epic', 'legendary'].map((rarity) => {
                            const rarityCards = playerData.cards.filter(card => card.rarity === rarity);
                            const maxedCards = rarityCards.filter(card => card.level === card.maxLevel);
                            const progress = rarityCards.length > 0 ? (maxedCards.length / rarityCards.length) * 100 : 0;
                            
                            return (
                              <div key={rarity} className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-300 capitalize font-medium">{rarity}</span>
                                  <span className="text-gray-400">{maxedCards.length}/{rarityCards.length}</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-white">Upgrade Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                            <h4 className="font-semibold text-blue-400 mb-2">Next Priority</h4>
                            <p className="text-white">
                              {getUpgradePriority(playerData.cards)[0]?.name || 'All cards maxed!'}
                            </p>
                          </div>
                          
                          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                            <h4 className="font-semibold text-purple-400 mb-2">Focus Rarity</h4>
                            <p className="text-white">
                              {stats && Object.entries(stats)
                                .filter(([key]) => ['common', 'rare', 'epic', 'legendary'].includes(key))
                                .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'Balanced'}
                            </p>
                          </div>
                          
                          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                            <h4 className="font-semibold text-green-400 mb-2">Completion Rate</h4>
                            <p className="text-white">
                              {stats ? Math.round((stats.maxed / stats.total) * 100) : 0}% Complete
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {/* Empty State */}
          {!playerData && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center py-20"
            >
              <div className="relative inline-block mb-8">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  <img 
                    src="/Design ohne Titel (16).png" 
                    alt="RoyaleCoach Logo" 
                    className="h-32 w-32 mx-auto logo-glow opacity-50"
                  />
                </motion.div>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Optimize Your Collection?</h3>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Enter your player tag above to get AI-powered insights and upgrade recommendations for your card collection.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}