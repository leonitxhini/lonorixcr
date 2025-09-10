"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DeckVisualizerProps {
  deck: string[];
  onCardClick?: (index: number) => void;
}

// Function to get card image URL
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
    'Ice Wizard': 'ice-wizard',
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
  };
  
  const id = cardNameToId[cardName] || cardName.toLowerCase().replace(/\s+/g, '-');
  return `https://royaleapi.com/static/img/cards-150/${id}.png`;
};

// Fallback emojis for cards
const cardEmojis: Record<string, string> = {
  'RoyaleCoach': '/Design ohne Titel (16).png',
  'Hog Rider': '🐗',
  'Fireball': '🔥',
  'Musketeer': '🔫',
  'Ice Spirit': '❄️',
  'Cannon': '🏰',
  'Log': '🪵',
  'Skeletons': '💀',
  'Ice Golem': '🧊',
  'Giant': '👹',
  'Wizard': '🧙‍♂️',
  'Mega Minion': '👾',
  'Zap': '⚡',
  'Arrows': '🏹',
  'Knight': '⚔️',
  'Archers': '🏹',
  'Goblin Barrel': '🛢️',
  'Princess': '👸',
  'Miner': '⛏️',
  'Balloon': '🎈',
  'Lava Hound': '🌋',
  'Golem': '🗿',
  'P.E.K.K.A': '🤖',
  'Electro Wizard': '⚡🧙‍♂️',
  'Bandit': '🗡️',
};

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-orange-400 to-orange-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600',
};

export function DeckVisualizer({ deck, onCardClick }: DeckVisualizerProps) {
  const getRarity = (cardName: string): keyof typeof rarityColors => {
    const legendaryCards = ['Princess', 'Miner', 'Lava Hound', 'Electro Wizard', 'Bandit'];
    const epicCards = ['Golem', 'P.E.K.K.A', 'Balloon'];
    const rareCards = ['Hog Rider', 'Fireball', 'Musketeer', 'Giant', 'Wizard', 'Mega Minion'];
    
    if (legendaryCards.includes(cardName)) return 'legendary';
    if (epicCards.includes(cardName)) return 'epic';
    if (rareCards.includes(cardName)) return 'rare';
    return 'common';
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {deck.map((card, index) => {
        const rarity = getRarity(card);
        const isEmpty = !card.trim();
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotateY: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCardClick?.(index)}
            className="cursor-pointer"
          >
            <Card className={`cr-card cr-hover-lift relative overflow-hidden ${isEmpty ? 'border-dashed border-2 border-gray-300' : `rarity-${rarity}`}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[rarity]} opacity-20`} />
              <CardContent className="p-4 text-center relative z-10">
                <div className="mb-2">
                  {isEmpty ? (
                    <div className="text-4xl">❓</div>
                  ) : (
                    <div className="relative w-16 h-16 mx-auto rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={getCardImageUrl(card)}
                        alt={card}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<div class="text-2xl flex items-center justify-center h-full">${cardEmojis[card] || '🃏'}</div>`;
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="text-xs font-medium truncate">
                  {isEmpty ? `Slot ${index + 1}` : card}
                </div>
                {!isEmpty && (
                  <Badge 
                    variant="secondary" 
                    className={`cr-badge ${rarity} mt-2 text-xs text-white border-0`}
                  >
                    {rarity}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}