"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Target, Shield, Zap, TrendingUp, Sparkles, RotateCcw, Copy, Shuffle, Save, Download, Upload, Star, Award, Swords, Crown, Gem, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DeckVisualizer } from '@/components/DeckVisualizer';
import { toast } from 'sonner';

interface DeckAnalysis {
  winCondition: string;
  strengths: string[];
  weaknesses: string[];
  strategy: string;
  tips: string[];
}

interface SavedDeck {
  id: string;
  name: string;
  cards: string[];
  analysis?: DeckAnalysis;
  createdAt: Date;
  rating?: number;
}

export default function DeckCoach() {
  const [deck, setDeck] = useState<string[]>(Array(8).fill(''));
  const [analysis, setAnalysis] = useState<DeckAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState<Array<{deck: string[], analysis: DeckAnalysis}>>([]);
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);
  const [deckName, setDeckName] = useState('');
  const [activeTab, setActiveTab] = useState('builder');
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const [analysisDepth, setAnalysisDepth] = useState('standard');

  const popularCards = [
    'Hog Rider', 'Fireball', 'Musketeer', 'Ice Spirit', 'Cannon', 'Log', 'Skeletons', 'Ice Golem',
    'Giant', 'Wizard', 'Mega Minion', 'Zap', 'Arrows', 'Knight', 'Archers', 'Goblin Barrel',
    'Princess', 'Miner', 'Balloon', 'Lava Hound', 'Golem', 'P.E.K.K.A', 'Electro Wizard', 'Bandit',
    'Royal Giant', 'Elite Barbarians', 'Sparky', 'Inferno Dragon', 'Lumberjack', 'Ice Wizard',
    'Graveyard', 'Tornado', 'Clone', 'Rage', 'Freeze', 'Mirror', 'Poison', 'Lightning'
  ];

  const metaDecks = [
    {
      name: 'Hog Cycle',
      cards: ['Hog Rider', 'Fireball', 'Musketeer', 'Ice Spirit', 'Cannon', 'Log', 'Skeletons', 'Ice Golem'],
      rating: 4.8,
      winRate: 67
    },
    {
      name: 'Giant Beatdown',
      cards: ['Giant', 'Wizard', 'Mega Minion', 'Zap', 'Arrows', 'Knight', 'Archers', 'Musketeer'],
      rating: 4.6,
      winRate: 64
    },
    {
      name: 'Lava Loon',
      cards: ['Balloon', 'Lava Hound', 'Mega Minion', 'Zap', 'Arrows', 'Knight', 'Archers', 'Musketeer'],
      rating: 4.7,
      winRate: 65
    },
    {
      name: 'Golem Night Witch',
      cards: ['Golem', 'Mega Minion', 'Zap', 'Lightning', 'Night Witch', 'Baby Dragon', 'Lumber Jack', 'Tornado'],
      rating: 4.5,
      winRate: 62
    },
  ];

  const cardCategories = {
    'Win Conditions': ['Hog Rider', 'Giant', 'Royal Giant', 'Balloon', 'Miner', 'Graveyard'],
    'Spells': ['Fireball', 'Zap', 'Arrows', 'Log', 'Lightning', 'Poison', 'Freeze', 'Rage'],
    'Defense': ['Cannon', 'Inferno Tower', 'Tesla', 'Bomb Tower', 'X-Bow', 'Mortar'],
    'Support': ['Musketeer', 'Wizard', 'Ice Wizard', 'Electro Wizard', 'Princess', 'Archers'],
    'Tanks': ['Golem', 'Lava Hound', 'P.E.K.K.A', 'Mega Knight', 'Giant Skeleton'],
    'Swarm': ['Skeletons', 'Goblins', 'Minions', 'Bats', 'Skeleton Army']
  };

  useEffect(() => {
    if (autoAnalyze && deck.filter(c => c.trim()).length === 8) {
      handleAnalyze();
    }
  }, [deck, autoAnalyze]);

  const handleCardChange = (index: number, value: string) => {
    const newDeck = [...deck];
    newDeck[index] = value;
    setDeck(newDeck);
  };

  const fillRandomCard = (index: number) => {
    const unusedCards = popularCards.filter(card => !deck.includes(card));
    if (unusedCards.length > 0) {
      const randomCard = unusedCards[Math.floor(Math.random() * unusedCards.length)];
      handleCardChange(index, randomCard);
    }
  };

  const handleAnalyze = async () => {
    const filledDeck = deck.filter(card => card.trim() !== '');
    if (filledDeck.length !== 8) {
      setError('Please fill all 8 card slots');
      toast.error('❌ Please fill all 8 card slots');
      return;
    }

    setLoading(true);
    setError('');
    console.log('Analyzing deck:', filledDeck);

    try {
      const response = await fetch('/api/deck-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          deck: filledDeck,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Analysis failed`);
      }

      const data = await response.json();
      console.log('Analysis received:', data);
      
      // Validate analysis data
      if (!data.winCondition || !data.strengths || !data.weaknesses || !data.strategy || !data.tips) {
        throw new Error('Invalid analysis data received');
      }
      
      setAnalysis(data);
      setAnalysisHistory(prev => [...prev, { deck: [...filledDeck], analysis: data }].slice(-10));
      toast.success('🧠 Deck analysis completed!');
    } catch (err) {
      console.error('Deck analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to analyze deck: ${errorMessage}`);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const clearDeck = () => {
    setDeck(Array(8).fill(''));
    setAnalysis(null);
    setError('');
    toast.success('🗑️ Deck cleared!');
  };

  const loadMetaDeck = (metaDeck: string[]) => {
    setDeck(metaDeck);
    toast.success('📋 Meta deck loaded!');
  };

  const copyDeck = () => {
    const deckString = deck.filter(card => card.trim()).join(', ');
    navigator.clipboard.writeText(deckString);
    toast.success('📋 Deck copied to clipboard!');
  };

  const randomizeDeck = () => {
    const shuffled = [...popularCards].sort(() => 0.5 - Math.random());
    setDeck(shuffled.slice(0, 8));
    toast.success('🎲 Random deck generated!');
  };

  const saveDeck = () => {
    if (!deckName.trim()) {
      toast.error('Please enter a deck name');
      return;
    }
    
    const newDeck: SavedDeck = {
      id: Date.now().toString(),
      name: deckName,
      cards: [...deck],
      analysis: analysis ?? undefined,
      createdAt: new Date(),
      rating: Math.floor(Math.random() * 5) + 1
    };
    
    setSavedDecks(prev => [...prev, newDeck]);
    setDeckName('');
    toast.success('💾 Deck saved successfully!');
  };

  const getElixirCost = (cardName: string) => {
    const costs: Record<string, number> = {
      'Skeletons': 1, 'Ice Spirit': 1, 'Bats': 2, 'Zap': 2, 'Log': 2,
      'Knight': 3, 'Archers': 3, 'Cannon': 3, 'Musketeer': 4, 'Fireball': 4,
      'Hog Rider': 4, 'Giant': 5, 'Wizard': 5, 'P.E.K.K.A': 7, 'Golem': 8
    };
    return costs[cardName] || 4;
  };

  const getAverageElixir = () => {
    const filledCards = deck.filter(card => card.trim());
    if (filledCards.length === 0) return 0;
    const total = filledCards.reduce((sum, card) => sum + getElixirCost(card), 0);
    return (total / filledCards.length).toFixed(1);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ultra-Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(147,51,234,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(251,191,36,0.1),transparent_50%)]" />
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
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
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="inline-block mb-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-2xl scale-150 -z-10 animate-pulse"></div>
              <img 
                src="/Design ohne Titel (16).png" 
                alt="RoyaleCoach Logo" 
                className="h-32 w-32 mx-auto drop-shadow-2xl logo-glow logo-hover logo-float relative z-10"
              />
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Lonorix CR - AI Deck Coach
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Advanced GPT-4 powered deck analysis with{' '}
              <span className="text-purple-400 font-semibold">pro-level strategic insights</span>
            </motion.p>
          </motion.div>

          {/* Advanced Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-600 p-1 h-14">
              <TabsTrigger 
                value="builder" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white h-12 text-base"
              >
                <Target className="h-4 w-4 mr-2" />
                Deck Builder
              </TabsTrigger>
              <TabsTrigger 
                value="meta"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white h-12 text-base"
              >
                <Crown className="h-4 w-4 mr-2" />
                Meta Decks
              </TabsTrigger>
              <TabsTrigger 
                value="analysis"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white h-12 text-base"
              >
                <Brain className="h-4 w-4 mr-2" />
                Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="saved"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white h-12 text-base"
              >
                <Save className="h-4 w-4 mr-2" />
                Saved Decks
              </TabsTrigger>
            </TabsList>

            {/* Deck Builder Tab */}
            <TabsContent value="builder" className="space-y-8">
              {/* Deck Builder Controls */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-purple-500/30 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Advanced Deck Builder
                      </span>
                    </CardTitle>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={autoAnalyze}
                          onCheckedChange={setAutoAnalyze}
                          className="data-[state=checked]:bg-purple-600"
                        />
                        <label className="text-sm font-medium text-gray-300">Auto-Analyze</label>
                      </div>
                      
                      <Select value={analysisDepth} onValueChange={setAnalysisDepth}>
                        <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="quick">Quick Analysis</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="deep">Deep Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Deck Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{deck.filter(c => c.trim()).length}</p>
                      <p className="text-sm text-gray-400">Cards</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{getAverageElixir()}</p>
                      <p className="text-sm text-gray-400">Avg Elixir</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">
                        {deck.filter(c => c.trim()).length === 8 ? '✓' : '✗'}
                      </p>
                      <p className="text-sm text-gray-400">Complete</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">
                        {analysis ? '🧠' : '⏳'}
                      </p>
                      <p className="text-sm text-gray-400">Analysis</p>
                    </div>
                  </div>

                  {/* Visual Deck Builder */}
                  <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-600">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                      Visual Deck Builder
                    </h3>
                    <DeckVisualizer 
                      deck={deck} 
                      onCardClick={(index) => {
                        const input = document.getElementById(`card-${index}`);
                        input?.focus();
                      }}
                    />
                  </div>
                  
                  {/* Card Input Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {deck.map((card, index) => (
                      <motion.div 
                        key={index} 
                        className="space-y-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </span>
                          Card {index + 1}
                        </label>
                        <div className="flex gap-2">
                          <Input
                            id={`card-${index}`}
                            placeholder="Enter card name"
                            value={card}
                            onChange={(e) => handleCardChange(index, e.target.value)}
                            list={`cards-${index}`}
                            className="bg-slate-700/50 border-slate-600 focus:border-purple-500 text-white placeholder-gray-400"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fillRandomCard(index)}
                            className="px-3 border-slate-600 hover:border-purple-500 hover:bg-purple-500/20"
                            title="Random card"
                          >
                            🎲
                          </Button>
                        </div>
                        <datalist id={`cards-${index}`}>
                          {popularCards.map(cardName => (
                            <option key={cardName} value={cardName} />
                          ))}
                        </datalist>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Quick Add Categories */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      Quick Add by Category
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(cardCategories).map(([category, cards]) => (
                        <Card key={category} className="bg-slate-800/30 border-slate-600 hover:border-purple-500/50 transition-colors">
                          <CardContent className="p-4">
                            <h5 className="font-semibold text-white mb-2">{category}</h5>
                            <div className="flex flex-wrap gap-1">
                              {cards.slice(0, 4).map(cardName => {
                                const getCardImageUrl = (cardName: string) => {
                                  const cardNameToId: Record<string, string> = {
                                    'Cannon': 'cannon',
                                    'Hog Rider': 'hog-rider',
                                    'Fireball': 'fireball',
                                    'Musketeer': 'musketeer',
                                    'Ice Spirit': 'ice-spirit',
                                    'Log': 'the-log',
                                    'Skeletons': 'skeletons',
                                    'Ice Golem': 'ice-golem',
                                    'Giant': 'giant',
                                    'Wizard': 'wizard',
                                    'Mega Minion': 'mega-minion',
                                    'Zap': 'zap',
                                    'Arrows': 'arrows',
                                    'Knight': 'knight',
                                    'Archers': 'archers',
                                    'Goblin Barrel': 'goblin-barrel',
                                    'Princess': 'princess',
                                    'Miner': 'miner',
                                    'Balloon': 'balloon',
                                    'Lava Hound': 'lava-hound',
                                    'Golem': 'golem',
                                    'P.E.K.K.A': 'pekka',
                                    'Electro Wizard': 'electro-wizard',
                                    'Bandit': 'bandit',
                                    'Royal Giant': 'royal-giant',
                                    'Elite Barbarians': 'elite-barbarians',
                                    'Sparky': 'sparky',
                                    'Inferno Dragon': 'inferno-dragon',
                                    'Lumberjack': 'lumberjack',
                                    'Ice Wizard': 'ice-wizard',
                                    'Graveyard': 'graveyard',
                                    'Tornado': 'tornado',
                                    'Clone': 'clone',
                                    'Rage': 'rage',
                                    'Freeze': 'freeze',
                                    'Mirror': 'mirror',
                                    'Poison': 'poison',
                                    'Lightning': 'lightning',
                                    'Night Witch': 'night-witch',
                                    'Baby Dragon': 'baby-dragon',
                                    'Inferno Tower': 'inferno-tower',
                                    'Tesla': 'tesla',
                                    'Bomb Tower': 'bomb-tower',
                                    'X-Bow': 'x-bow',
                                    'Mortar': 'mortar',
                                    'Goblins': 'goblins',
                                    'Minions': 'minions',
                                    'Bats': 'bats',
                                    'Skeleton Army': 'skeleton-army',
                                    'Giant Skeleton': 'giant-skeleton',
                                    'Mega Knight': 'mega-knight',
                                  };
                                  
                                  const id = cardNameToId[cardName] || cardName.toLowerCase().replace(/\s+/g, '-');
                                  return `https://royaleapi.com/static/img/cards-150/${id}.png`;
                                };

                                return (
                                  <div
                                    key={cardName}
                                    className="cursor-pointer hover:bg-purple-500/20 border border-slate-500 rounded-lg p-1 flex items-center gap-1 text-xs text-gray-300 hover:border-purple-500 transition-colors"
                                    onClick={() => {
                                      const emptyIndex = deck.findIndex(c => c.trim() === '');
                                      if (emptyIndex !== -1 && !deck.includes(cardName)) {
                                        handleCardChange(emptyIndex, cardName);
                                      }
                                    }}
                                  >
                                    <div className="relative w-4 h-4 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                                      <img
                                        src={getCardImageUrl(cardName)}
                                        alt={cardName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                          target.parentElement!.innerHTML = '<div class="text-xs flex items-center justify-center h-full">🃏</div>';
                                        }}
                                      />
                                    </div>
                                    <span className="truncate max-w-20">{cardName}</span>
                                  </div>
                                );
                              })}
                              {cards.length > 4 && (
                                <Badge variant="outline" className="border-slate-500 text-gray-400 text-xs">
                                  +{cards.length - 4}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={loading || deck.filter(c => c.trim()).length !== 8} 
                      className="cr-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 cr-glow"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Brain className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <Brain className="h-5 w-5 mr-2" />
                      )}
                      {loading ? 'Analyzing...' : 'Analyze Deck'}
                    </Button>
                    
                    <Button variant="outline" onClick={randomizeDeck} className="border-slate-600 hover:border-blue-500 hover:bg-blue-500/20 text-white">
                      <Shuffle className="h-4 w-4 mr-2" />
                      Random Deck
                    </Button>
                    
                    <Button variant="outline" onClick={copyDeck} className="border-slate-600 hover:border-green-500 hover:bg-green-500/20 text-white">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Deck
                    </Button>
                    
                    <Button variant="outline" onClick={clearDeck} className="border-slate-600 hover:border-red-500 hover:bg-red-500/20 text-white">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>

                  {/* Save Deck */}
                  {deck.filter(c => c.trim()).length === 8 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-600"
                    >
                      <Input
                        placeholder="Enter deck name to save..."
                        value={deckName}
                        onChange={(e) => setDeckName(e.target.value)}
                        className="flex-1 bg-slate-700 border-slate-600 text-white"
                      />
                      <Button onClick={saveDeck} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500">
                        <Save className="h-4 w-4 mr-2" />
                        Save Deck
                      </Button>
                    </motion.div>
                  )}

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
            </TabsContent>

            {/* Meta Decks Tab */}
            <TabsContent value="meta" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    Meta Deck Library
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {metaDecks.map((metaDeck, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card className="bg-slate-700/50 border-slate-600 hover:border-purple-500/50 transition-colors cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-white mb-2">{metaDeck.name}</h3>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span className="text-yellow-400 font-medium">{metaDeck.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Trophy className="h-4 w-4 text-green-400" />
                                    <span className="text-green-400 font-medium">{metaDeck.winRate}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                onClick={() => loadMetaDeck(metaDeck.cards)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Load
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2">
                              {metaDeck.cards.slice(0, 8).map((cardName, cardIndex) => {
                                const getCardImageUrl = (cardName: string) => {
                                  const cardNameToId: Record<string, string> = {
                                    'Cannon': 'cannon',
                                    'Hog Rider': 'hog-rider',
                                    'Fireball': 'fireball',
                                    'Musketeer': 'musketeer',
                                    'Ice Spirit': 'ice-spirit',
                                    'Log': 'the-log',
                                    'Skeletons': 'skeletons',
                                    'Ice Golem': 'ice-golem',
                                    'Giant': 'giant',
                                    'Wizard': 'wizard',
                                    'Mega Minion': 'mega-minion',
                                    'Zap': 'zap',
                                    'Arrows': 'arrows',
                                    'Knight': 'knight',
                                    'Archers': 'archers',
                                    'Goblin Barrel': 'goblin-barrel',
                                    'Princess': 'princess',
                                    'Miner': 'miner',
                                    'Balloon': 'balloon',
                                    'Lava Hound': 'lava-hound',
                                    'Golem': 'golem',
                                    'P.E.K.K.A': 'pekka',
                                    'Electro Wizard': 'electro-wizard',
                                    'Bandit': 'bandit',
                                    'Royal Giant': 'royal-giant',
                                    'Elite Barbarians': 'elite-barbarians',
                                    'Sparky': 'sparky',
                                    'Inferno Dragon': 'inferno-dragon',
                                    'Lumberjack': 'lumberjack',
                                    'Ice Wizard': 'ice-wizard',
                                    'Graveyard': 'graveyard',
                                    'Tornado': 'tornado',
                                    'Clone': 'clone',
                                    'Rage': 'rage',
                                    'Freeze': 'freeze',
                                    'Mirror': 'mirror',
                                    'Poison': 'poison',
                                    'Lightning': 'lightning',
                                    'Night Witch': 'night-witch',
                                    'Baby Dragon': 'baby-dragon',
                                  };
                                  
                                  const id = cardNameToId[cardName] || cardName.toLowerCase().replace(/\s+/g, '-');
                                  return `https://royaleapi.com/static/img/cards-150/${id}.png`;
                                };

                                return (
                                  <div key={cardIndex} className="bg-slate-800/50 rounded-lg p-2 text-center border border-slate-600">
                                    <div className="relative w-12 h-12 mx-auto mb-1 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                      <img
                                        src={getCardImageUrl(cardName)}
                                        alt={cardName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                          target.parentElement!.innerHTML = '<div class="text-2xl flex items-center justify-center h-full">🃏</div>';
                                        }}
                                      />
                                    </div>
                                    <p className="text-xs text-gray-300 truncate">{cardName}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              {analysis ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Analysis Header */}
                  <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-block mb-4"
                        >
                          <Brain className="h-16 w-16 text-purple-400" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-4">AI Analysis Complete</h2>
                        <p className="text-xl text-purple-300">{analysis.winCondition}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed Analysis */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <Card className="bg-slate-800/50 border-green-500/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Shield className="h-5 w-5 text-green-400" />
                          Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysis.strengths.map((strength, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                            >
                              <div className="bg-green-500 rounded-full p-1 mt-1">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              <p className="text-gray-300 leading-relaxed">{strength}</p>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Weaknesses */}
                    <Card className="bg-slate-800/50 border-red-500/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Swords className="h-5 w-5 text-red-400" />
                          Weaknesses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysis.weaknesses.map((weakness, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                            >
                              <div className="bg-red-500 rounded-full p-1 mt-1">
                                <span className="text-white text-xs">!</span>
                              </div>
                              <p className="text-gray-300 leading-relaxed">{weakness}</p>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Strategy & Tips */}
                  <Card className="bg-slate-800/50 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        Strategy & Pro Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <h4 className="font-semibold text-blue-400 mb-2">Overall Strategy</h4>
                        <p className="text-gray-300 leading-relaxed">{analysis.strategy}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.tips.map((tip, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-purple-500/50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <p className="text-gray-300 leading-relaxed">{tip}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="text-center py-20">
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
                  >
                    <Brain className="h-24 w-24 mx-auto text-purple-400 opacity-50 mb-6" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-4">Ready for AI Analysis</h3>
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Build your deck and get expert-level strategic insights powered by advanced AI.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Saved Decks Tab */}
            <TabsContent value="saved" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Save className="h-5 w-5 text-green-400" />
                    Your Saved Decks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {savedDecks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedDecks.map((savedDeck) => (
                        <motion.div
                          key={savedDeck.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Card className="bg-slate-700/50 border-slate-600 hover:border-purple-500/50 transition-colors">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-lg font-bold text-white mb-1">{savedDeck.name}</h3>
                                  <p className="text-sm text-gray-400">
                                    Saved {savedDeck.createdAt.toLocaleDateString()}
                                  </p>
                                  {savedDeck.rating && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Star className="h-4 w-4 text-yellow-400" />
                                      <span className="text-yellow-400">{savedDeck.rating}/5</span>
                                    </div>
                                  )}
                                </div>
                                
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setDeck(savedDeck.cards);
                                    if (savedDeck.analysis) setAnalysis(savedDeck.analysis);
                                    setActiveTab('builder');
                                    toast.success('Deck loaded!');
                                  }}
                                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                                >
                                  <Upload className="h-4 w-4 mr-1" />
                                  Load
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-2">
                                {savedDeck.cards.map((cardName, cardIndex) => (
                                  <div key={cardIndex} className="bg-slate-800/50 rounded p-2 text-center border border-slate-600">
                                    <div className="text-lg mb-1">🃏</div>
                                    <p className="text-xs text-gray-300 truncate">{cardName}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Save className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No Saved Decks</h3>
                      <p className="text-gray-400">Build and save your first deck to see it here!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}