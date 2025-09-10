"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, Zap, Target, Brain, Sparkles, TrendingUp, Users, Award, Trophy, Star, Flame, Clock, TrendingDown, ArrowUp, ArrowDown, Play, Calendar, MessageSquare, Share2, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ParticleBackground } from '@/components/ParticleBackground';
import { LiveStats } from '@/components/LiveStats';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [deckOfTheWeek, setDeckOfTheWeek] = useState(null);
  const [trendingDecks, setTrendingDecks] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deckResponse, trendingResponse, playersResponse] = await Promise.all([
          fetch('/api/deck-of-week'),
          fetch('/api/trending-decks'),
          fetch('/api/top-players')
        ]);

        if (deckResponse.ok) {
          const deckData = await deckResponse.json();
          setDeckOfTheWeek(deckData.deck);
        } else {
          console.error('Deck of week API error:', deckResponse.status);
        }

        if (trendingResponse.ok) {
          const trendingData = await trendingResponse.json();
          setTrendingDecks(trendingData.decks);
        } else {
          console.error('Trending decks API error:', trendingResponse.status);
        }

        if (playersResponse.ok) {
          const playersData = await playersResponse.json();
          setTopPlayers(playersData.players);
        } else {
          console.error('Top players API error:', playersResponse.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: Target,
      title: 'Card Planning',
      description: 'AI-powered card collection analysis with smart upgrade paths and resource optimization.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Brain,
      title: 'AI Deck Coach',
      description: 'Advanced GPT-4 powered deck analysis with meta insights and pro-level strategies.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Real-time Data',
      description: 'Live player statistics and meta tracking with instant updates from official APIs.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Sparkles,
      title: 'Meta Tracker',
      description: 'Track the current meta, popular decks, and win rates across all arenas.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Detailed analytics and progress tracking with personalized improvement suggestions.',
      gradient: 'from-red-500 to-rose-500',
    },
    {
      icon: Users,
      title: 'Community Hub',
      description: 'Connect with other players, share decks, and learn from the community.',
      gradient: 'from-indigo-500 to-blue-500',
    },
  ];

  const achievements = [
    { icon: Users, label: 'Active Players', value: '50K+', color: 'text-blue-500' },
    { icon: Brain, label: 'Decks Analyzed', value: '1M+', color: 'text-purple-500' },
    { icon: Award, label: 'Win Rate Boost', value: '23%', color: 'text-green-500' },
    { icon: TrendingUp, label: 'Trophy Gain', value: '+156', color: 'text-yellow-500' },
  ];


  // News & Updates
  const newsItems = [
    { title: "New Card: Electro Giant", date: "2 days ago", type: "update", trending: true },
    { title: "Meta Shift: Beatdown Decks Rising", date: "1 week ago", type: "meta", trending: false },
    { title: "Tournament Results: CRL World Finals", date: "3 days ago", type: "tournament", trending: true },
    { title: "Balance Changes Coming Soon", date: "5 days ago", type: "balance", trending: false },
  ];


  const getCardImageUrl = (cardName: string) => {
    const cardNameToId: Record<string, string> = {
      // Common Cards
      'Archers': 'archers',
      'Arrows': 'arrows',
      'Bomber': 'bomber',
      'Cannon': 'cannon',
      'Fire Spirits': 'fire-spirits',
      'Goblins': 'goblins',
      'Ice Spirit': 'ice-spirit',
      'Knight': 'knight',
      'Minions': 'minions',
      'Mortar': 'mortar',
      'Skeletons': 'skeletons',
      'Spear Goblins': 'spear-goblins',
      'Tesla': 'tesla',
      'Zap': 'zap',
      
      // Rare Cards
      'Barbarians': 'barbarians',
      'Bomb Tower': 'bomb-tower',
      'Dart Goblin': 'dart-goblin',
      'Elixir Collector': 'elixir-collector',
      'Fireball': 'fireball',
      'Furnace': 'furnace',
      'Giant': 'giant',
      'Goblin Gang': 'goblin-gang',
      'Goblin Hut': 'goblin-hut',
      'Heal Spirit': 'heal-spirit',
      'Hog Rider': 'hog-rider',
      'Ice Golem': 'ice-golem',
      'Ice Wizard': 'ice-wizard',
      'Mega Minion': 'mega-minion',
      'Mini P.E.K.K.A': 'mini-pekka',
      'Musketeer': 'musketeer',
      'Rocket': 'rocket',
      'Tombstone': 'tombstone',
      'Valkyrie': 'valkyrie',
      'Wizard': 'wizard',
      
      // Epic Cards
      'Baby Dragon': 'baby-dragon',
      'Balloon': 'balloon',
      'Bowler': 'bowler',
      'Cannon Cart': 'cannon-cart',
      'Dark Prince': 'dark-prince',
      'Electro Dragon': 'electro-dragon',
      'Electro Giant': 'electro-giant',
      'Executioner': 'executioner',
      'Freeze': 'freeze',
      'Giant Skeleton': 'giant-skeleton',
      'Goblin Barrel': 'goblin-barrel',
      'Golem': 'golem',
      'Guards': 'guards',
      'Lightning': 'lightning',
      'Mirror': 'mirror',
      'Night Witch': 'night-witch',
      'Poison': 'poison',
      'Prince': 'prince',
      'Rage': 'rage',
      'Skeleton Army': 'skeleton-army',
      'Tornado': 'tornado',
      'Witch': 'witch',
      'X-Bow': 'x-bow',
      
      // Legendary Cards
      'Bandit': 'bandit',
      'Electro Wizard': 'electro-wizard',
      'Fisherman': 'fisherman',
      'Graveyard': 'graveyard',
      'Inferno Dragon': 'inferno-dragon',
      'Lava Hound': 'lava-hound',
      'Lumberjack': 'lumberjack',
      'Magic Archer': 'magic-archer',
      'Mega Knight': 'mega-knight',
      'Miner': 'miner',
      'Princess': 'princess',
      'Ram Rider': 'ram-rider',
      'Royal Ghost': 'royal-ghost',
      'Sparky': 'sparky',
      'The Log': 'the-log',
      'Log': 'the-log',
      'Three Musketeers': 'three-musketeers',
      
      // Champion Cards
      'Archer Queen': 'archer-queen',
      'Golden Knight': 'golden-knight',
      'Mighty Miner': 'mighty-miner',
      'Monk': 'monk',
      'Skeleton King': 'skeleton-king',
      
      // Additional Cards (only unique ones not in other categories)
      'Bats': 'bats',
      'Battle Ram': 'battle-ram',
      'Clone': 'clone',
      'Elite Barbarians': 'elite-barbarians',
      'Firecracker': 'firecracker',
      'Flying Machine': 'flying-machine',
      'Goblin Cage': 'goblin-cage',
      'Goblin Drill': 'goblin-drill',
      'Goblin Giant': 'goblin-giant',
      'Hunter': 'hunter',
      'Inferno Tower': 'inferno-tower',
      'Mother Witch': 'mother-witch',
      'P.E.K.K.A': 'pekka',
      'PEKKA': 'pekka',
      'Rascals': 'rascals',
      'Royal Delivery': 'royal-delivery',
      'Royal Giant': 'royal-giant',
      'Royal Hogs': 'royal-hogs',
      'Royal Recruits': 'royal-recruits',
      'Skeleton Barrel': 'skeleton-barrel',
      'Skeleton Dragons': 'skeleton-dragons',
      'Wall Breakers': 'wall-breakers',
      'Zappies': 'zappies',
    };
    
    const id = cardNameToId[cardName] || cardName.toLowerCase().replace(/\s+/g, '-');
    return `https://royaleapi.com/static/img/cards-150/${id}.png`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
                  {/* Hero Section */}
                  <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-yellow-600/30" />
                    <div className="max-w-7xl mx-auto text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative z-10"
                      >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8">
                          <span className="clash-text-gradient">Lonorix CR</span>
                        </h1>
                        <motion.p
                          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 sm:mb-12 max-w-4xl mx-auto font-light px-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                        >
                          Master the Arena with <span className="neon-blue font-semibold">AI-Powered</span> Strategies
                        </motion.p>

                        <motion.div
                          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.6 }}
                        >
                          <Link href="/card-planner" className="w-full sm:w-auto">
                            <Button size="lg" className="cr-button w-full text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg cr-glow">
                              <Target className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                              Card Planner
                            </Button>
                          </Link>
                          <Link href="/deck-coach" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="cr-button w-full border-2 border-blue-400 text-blue-400 hover:bg-blue-900/30 hover:neon-blue px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg cr-glow">
                              <Brain className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                              AI Deck Coach
                            </Button>
                          </Link>
                        </motion.div>

            {/* Achievement Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <achievement.icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-1 sm:mb-2 ${achievement.color}`} />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">{achievement.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{achievement.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

                  {/* Deck der Woche Section */}
                  <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-7xl mx-auto">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center mb-8 sm:mb-12"
                      >
                        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <Crown className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-400" />
                          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            <span className="clash-text-gradient">Deck of the Week</span>
                          </h2>
                          <Crown className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-400" />
                        </div>
                        <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">
                          The dominating deck of the current meta
                        </p>
                      </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
                        {deckOfTheWeek ? (
                          <Card className="cr-card cr-glow relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20" />
                            <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
                            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                              {/* Deck Info */}
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4">
                                  <Badge className="cr-badge legendary text-xs sm:text-sm">Deck of the Week</Badge>
                                  <div className="flex items-center gap-1">
                                    {(deckOfTheWeek?.trend === "up") ? (
                                      <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                                    ) : (
                                      <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                                    )}
                                    <span className={`text-xs sm:text-sm font-medium ${(deckOfTheWeek?.trend === "up") ? "text-green-400" : "text-red-400"}`}>
                                      {deckOfTheWeek?.change || "0%"}
                                    </span>
                                  </div>
                                </div>

                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{deckOfTheWeek?.name || 'Loading...'}</h3>
                                <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">by {deckOfTheWeek?.creator || 'Loading...'}</p>
                                <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-4 sm:mb-6">{deckOfTheWeek?.description || 'Loading deck data...'}</p>

                                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                  <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 text-center">
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">{deckOfTheWeek?.winRate || 0}%</div>
                                    <div className="text-xs sm:text-sm text-gray-400">Win Rate</div>
                                  </div>
                                  <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 text-center">
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">{deckOfTheWeek?.usage || 0}%</div>
                                    <div className="text-xs sm:text-sm text-gray-400">Usage Rate</div>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                  <Button className="cr-button cr-glow text-sm sm:text-base">
                                    <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                    Test Deck
                                  </Button>
                                  <Button variant="outline" className="cr-button border-blue-400 text-blue-400 hover:bg-blue-900/30 text-sm sm:text-base">
                                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                    Share
                                  </Button>
                                </div>
                              </div>

                              {/* Deck Cards */}
                              <div className="flex-1">
                                <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Deck Composition</h4>
                                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                  {deckOfTheWeek?.cards?.map((card, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.6 + index * 0.1 }}
                                      className="bg-slate-800/50 rounded-lg p-2 sm:p-3 text-center border border-slate-600 hover:border-yellow-500/50 transition-colors"
                                    >
                                      <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 sm:mb-2 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        <Image
                                          src={getCardImageUrl(card)}
                                          alt={card}
                                          fill
                                          className="object-cover"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement!.innerHTML = '<div class="text-sm sm:text-lg flex items-center justify-center h-full">🃏</div>';
                                          }}
                                        />
                                      </div>
                                      <p className="text-xs text-gray-300 truncate">{card}</p>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Deck of the week data not available</p>
                <p className="text-gray-500 text-sm">API key required for real data</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Trending Decks Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-400" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                <span className="clash-text-gradient">Trending Decks</span>
              </h2>
              <Flame className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-orange-400" />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">
              The hottest decks of the current meta
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingDecks.length > 0 ? trendingDecks.map((deck, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="cr-card cr-hover-lift">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <Badge className={`cr-badge ${deck.trend === "up" ? "legendary" : "common"} text-xs sm:text-sm`}>
                        #{index + 1}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {deck.trend === "up" ? (
                          <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                        ) : (
                          <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                        )}
                        <span className={`text-xs sm:text-sm font-medium ${deck.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                          {deck.change}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">{deck.name}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Win Rate</span>
                        <span className="text-green-400 font-medium">{deck.winRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Usage</span>
                        <span className="text-blue-400 font-medium">{deck.usage}%</span>
                      </div>
                    </div>
                    
                    <Button className="cr-button w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">Trending decks data not available</p>
                <p className="text-gray-500 text-sm">API key required for real data</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageSquare className="h-8 w-8 text-blue-400" />
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                <span className="clash-text-gradient">News & Updates</span>
              </h2>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-xl text-gray-300">
              The latest updates and meta developments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems.map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="cr-card cr-hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className={`cr-badge ${news.type === 'update' ? 'legendary' : news.type === 'tournament' ? 'epic' : 'common'}`}>
                          {news.type}
                        </Badge>
                        {news.trending && (
                          <Badge className="cr-badge rare">
                            <Flame className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-400">{news.date}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-3">{news.title}</h3>
                    
                    <div className="flex items-center gap-3">
                      <Button size="sm" className="cr-button">
                        <Eye className="h-4 w-4 mr-2" />
                        Read
                      </Button>
                      <Button size="sm" variant="outline" className="cr-button border-gray-500 text-gray-300 hover:bg-gray-800">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Players Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Trophy className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-400" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                <span className="clash-text-gradient">Top Players</span>
              </h2>
              <Star className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-400" />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">
              The best players in the world
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {topPlayers.length > 0 ? topPlayers.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="cr-card cr-hover-lift">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                      {index === 0 && <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mr-2" />}
                      <Badge className={`cr-badge ${index === 0 ? 'legendary' : index === 1 ? 'epic' : index === 2 ? 'rare' : 'common'} text-xs sm:text-sm`}>
                        #{player.rank}
                      </Badge>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{player.name}</h3>
                    
                    <div className="space-y-2 mb-3 sm:mb-4">
                      <div className="text-xl sm:text-2xl font-bold text-yellow-400">{player.trophies.toLocaleString()}</div>
                      <div className="text-xs sm:text-sm text-gray-400">Trophies</div>
                      <div className="flex items-center justify-center gap-1">
                        <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                        <span className="text-green-400 font-medium text-xs sm:text-sm">{player.change}</span>
                      </div>
                    </div>
                    
                    <Button className="cr-button w-full text-sm sm:text-base">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">Top players data not available</p>
                <p className="text-gray-500 text-sm">API key required for real data</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 neon-blue">
              Live Platform Stats
            </h2>
            <p className="text-lg text-gray-300">
              Real-time data from our growing community
            </p>
          </motion.div>
          <LiveStats />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="clash-text-gradient">Powerful Features</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced tools and AI-powered insights to dominate every battle
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="cr-card cr-hover-lift glass dark:glass-dark border-0 relative overflow-hidden h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10`} />
                  <CardContent className="p-8 text-center relative z-10">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${feature.gradient} mb-6 cr-pulse cr-glow`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card className="clash-gradient p-6 sm:p-8 md:p-12 text-white relative overflow-hidden pulse-glow">
            <div className="absolute inset-0 bg-black/20" />
            <CardContent className="p-0 relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 neon-gold">
                Ready to Become a Champion?
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 text-white/90 max-w-2xl mx-auto px-4">
                Join thousands of players who've already improved their gameplay with Lonorix CR's AI-powered tools
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link href="/card-planner" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" className="cr-button bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold cr-glow w-full">
                    <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Start Your Journey
                  </Button>
                </Link>
                <Link href="/about" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="cr-button border-white text-white hover:bg-white/20 hover:neon-gold px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg cr-glow w-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}