"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CardData {
  name: string;
  level: number;
  maxLevel: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  count: number;
  requiredForUpgrade: number;
  idName?: string; // Clash Royale card ID for image URL
}

interface CardCollectionProps {
  cards: CardData[];
}

// Function to get card image URL
const getCardImageUrl = (cardName: string, idName?: string) => {
  if (idName) {
    return `https://royaleapi.com/static/img/cards-150/${idName}.png`;
  }
  
  // Complete mapping for ALL Clash Royale cards
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
    
    // Additional Cards
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
    'Princess': 'princess',
    'Miner': 'miner',
    'Balloon': 'balloon',
    'Lava Hound': 'lava-hound',
    'Golem': 'golem',
    'P.E.K.K.A': 'pekka',
    'Electro Wizard': 'electro-wizard',
    'Bandit': 'bandit',
  };
  
  const id = cardNameToId[cardName] || cardName.toLowerCase().replace(/\s+/g, '-');
  return `https://royaleapi.com/static/img/cards-150/${id}.png`;
};

export function CardCollection({ cards }: CardCollectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'progress'>('progress');

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-orange-400 to-orange-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600',
  };

  const filteredAndSortedCards = cards
    .filter(card => 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRarity === 'all' || card.rarity === selectedRarity)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'level':
          return b.level - a.level;
        case 'progress':
          const aProgress = (a.level / a.maxLevel) * 100;
          const bProgress = (b.level / b.maxLevel) * 100;
          return aProgress - bProgress;
        default:
          return 0;
      }
    });

  const getUpgradePriority = (card: CardData) => {
    const progress = (card.level / card.maxLevel) * 100;
    if (progress < 30) return 'High';
    if (progress < 70) return 'Medium';
    return 'Low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="glass dark:glass-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Card Collection Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedRarity === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedRarity('all')}
                size="sm"
              >
                All
              </Button>
              {Object.keys(rarityColors).map(rarity => (
                <Button
                  key={rarity}
                  variant={selectedRarity === rarity ? 'default' : 'outline'}
                  onClick={() => setSelectedRarity(rarity)}
                  size="sm"
                  className="capitalize"
                >
                  {rarity}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 rounded border bg-background"
              >
                <option value="progress">Progress</option>
                <option value="name">Name</option>
                <option value="level">Level</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredAndSortedCards.map((card, index) => {
            const progress = (card.level / card.maxLevel) * 100;
            const priority = getUpgradePriority(card);
            
            return (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <Card className={`cr-card cr-hover-lift rarity-${card.rarity} relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[card.rarity]} opacity-10`} />
                  <CardContent className="p-4 relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={getCardImageUrl(card.name, card.idName)}
                            alt={card.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // Fallback to emoji if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = '🃏';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{card.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            Level {card.level}/{card.maxLevel}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={`cr-badge ${getPriorityColor(priority)} text-white text-xs`}>
                          {priority}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`cr-badge ${card.rarity} text-xs text-white border-0`}
                        >
                          {card.rarity}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="cr-progress h-2">
                        <div className="cr-progress-bar" style={{ width: `${progress}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Cards: {card.count}</span>
                        <span>Need: {card.requiredForUpgrade}</span>
                      </div>
                    </div>

                    {card.level < card.maxLevel && (
                      <Button 
                        size="sm" 
                        className="cr-button w-full mt-3"
                        disabled={card.count < card.requiredForUpgrade}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {card.count >= card.requiredForUpgrade ? 'Upgrade' : 'Collect More'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}