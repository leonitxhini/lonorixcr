"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Target, Shield, Zap, TrendingUp, Sparkles, RotateCcw, Copy, Shuffle, Save, Download, Upload, Star, Award, Swords, Crown, Gem, Trophy, Heart, Flame, Eye, BarChart3, Filter, Search, Settings, Play, Pause, RefreshCw, Maximize, Minimize, Volume2, VolumeX, Share2, Bookmark, Clock, Users, TrendingDown, AlertTriangle, CheckCircle, XCircle, Info, Lightbulb, Target as TargetIcon, Zap as ZapIcon, Sword, ArrowRight, ChevronDown, ChevronUp, Plus, Minus, Edit3, Trash2, MoreHorizontal, ExternalLink, Wifi, WifiOff, Battery, BatteryLow, Signal, SignalHigh, SignalLow, SignalZero, SignalMedium, SignalHigh as SignalFull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
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
  tags?: string[];
  winRate?: number;
  gamesPlayed?: number;
  favorite?: boolean;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Professional Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  AI Deck Coach
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Professional Deck Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoAnalyze(!autoAnalyze)}
                className={`${autoAnalyze ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' : ''}`}
              >
                <Zap className="h-4 w-4 mr-2" />
                Auto-Analyze
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Deck Builder */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Deck Stats */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {deck.filter(c => c.trim()).length}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Cards</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {getAverageElixir()}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Avg Elixir</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {deck.filter(c => c.trim()).length === 8 ? '✓' : '✗'}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {analysis ? '🧠' : '⏳'}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Analysis</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Input Grid */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Deck Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {deck.map((card, index) => {
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
                      <div key={index} className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Card {index + 1}
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              placeholder="Enter card name"
                              value={card}
                              onChange={(e) => handleCardChange(index, e.target.value)}
                              list={`cards-${index}`}
                              className="pl-10"
                            />
                            {card && (
                              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img
                                  src={getCardImageUrl(card)}
                                  alt={card}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.innerHTML = '<div class="text-xs flex items-center justify-center h-full">🃏</div>';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fillRandomCard(index)}
                            className="px-3"
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
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Add Categories */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Quick Add by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(cardCategories).map(([category, cards]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300 text-sm">
                        {category}
                      </h4>
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
                              className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
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
                          <Badge variant="secondary" className="text-xs">
                            +{cards.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={loading || deck.filter(c => c.trim()).length !== 8} 
                    className="col-span-2 sm:col-span-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Brain className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <Brain className="h-4 w-4 mr-2" />
                    )}
                    {loading ? 'Analyzing...' : 'Analyze Deck'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={randomizeDeck}
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Random
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={copyDeck}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={clearDeck}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => toast.info('Help feature coming soon!')}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Deck */}
            {deck.filter(c => c.trim()).length === 8 && (
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter deck name to save..."
                      value={deckName}
                      onChange={(e) => setDeckName(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={saveDeck} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Deck
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Right Column - Analysis & Meta */}
          <div className="space-y-6">
            
            {/* Analysis Results */}
            {analysis && (
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Win Condition</h4>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">{analysis.winCondition}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {analysis.strengths.slice(0, 3).map((strength, index) => (
                        <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Weaknesses</h4>
                    <ul className="space-y-1">
                      {analysis.weaknesses.slice(0, 3).map((weakness, index) => (
                        <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Meta Decks */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Meta Decks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metaDecks.map((metaDeck, index) => (
                  <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900 dark:text-white">{metaDeck.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">{metaDeck.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">{metaDeck.winRate}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Deck Cards Preview */}
                    <div className="grid grid-cols-4 gap-1 mb-3">
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
                          <div key={cardIndex} className="bg-slate-100 dark:bg-slate-700 rounded p-1 text-center border border-slate-200 dark:border-slate-600">
                            <div className="relative w-8 h-8 mx-auto mb-1 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
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
                            <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{cardName}</p>
                          </div>
                        );
                      })}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadMetaDeck(metaDeck.cards)}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Load Deck
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Saved Decks */}
            {savedDecks.length > 0 && (
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Save className="h-5 w-5 text-green-500" />
                    Saved Decks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {savedDecks.slice(0, 3).map((savedDeck) => (
                    <div key={savedDeck.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm">{savedDeck.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {savedDeck.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setDeck(savedDeck.cards);
                            if (savedDeck.analysis) setAnalysis(savedDeck.analysis);
                            toast.success('Deck loaded!');
                          }}
                        >
                          <Upload className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Deck Cards Preview */}
                      <div className="grid grid-cols-4 gap-1">
                        {savedDeck.cards.map((cardName, cardIndex) => (
                          <div key={cardIndex} className="bg-slate-100 dark:bg-slate-700 rounded p-1 text-center border border-slate-200 dark:border-slate-600">
                            <div className="text-lg mb-1">🃏</div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{cardName}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}