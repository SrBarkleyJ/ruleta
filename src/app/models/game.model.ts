// Sector with weight for probability-based selection
export interface Sector {
    id: string;
    label: string;
    color: string;
    multiplier: number;
    weight: number; // Higher weight = higher probability of being selected
    isCustomized?: boolean;
    isDeath?: boolean;
    shardProbability?: number; // Probability (0-1) of earning shards
    shardAmount?: number; // Amount of shards to earn
}

export interface WheelSkin {
    id: string;
    name: string;
    description: string;
    price: number;
    colors: string[]; // Palette for sectors
    borderColor: string;
    pointerColor: string;
    isLocked: boolean;
}

// Joker effects that modify gameplay
export type JokerEffectType =
    | 'win_multiplier' // Multiply winnings by X
    | 'sector_boost' // Boost specific sectors
    | 'refund' // Refund portion of bet
    | 'reroll' // Allow rerolling spins
    | 'weight_bonus' // Increase weight of certain sectors
    | 'chip_generation'; // Generate chips passively

export interface JokerEffect {
    type: JokerEffectType;
    value: number; // Numeric value for the effect
    targetSectorId?: string; // Optional: specific sector to affect
}

export interface Joker {
    id: string;
    name: string;
    description: string;
    effects: JokerEffect[];
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    cost: number;
    icon: string; // Emoji or icon identifier
    isUnlocked: boolean;
}

// Passive amulets (similar to jokers but always active)
export interface Amulet {
    id: string;
    name: string;
    description: string;
    effect: JokerEffect;
    rarity: 'common' | 'uncommon' | 'rare';
    cost: number;
    icon: string;
}

// Track statistics for the current run
export interface RunStats {
    runNumber: number;
    totalSpins: number;
    highestWin: number;
    totalWinnings: number;
    sectorsHit: { [sectorId: string]: number }; // Track how many times each sector was hit
    startingChips: number;
}

// Blind types for roguelike progression
export type BlindType = 'SMALL' | 'BIG' | 'BOSS';

export interface BlindState {
    type: BlindType;
    targetScore: number;
    currentScore: number;
    spinsRemaining: number;
    spinsTotal: number;
    reward: number;
}

// Complete game state
export interface GameState {
    chips: number;
    sectors: Sector[];
    currentAnte: number;
    blindState: BlindState;
    lastWin: number;
    jokers: Joker[]; // Active jokers in this run
    amulets: Amulet[]; // Active amulets in this run
    runStats: RunStats;
    metaCurrency: number; // Persistent currency across runs
    isGameOver: boolean;
    isShopOpen: boolean;
    selectedBet: number;
    availableBets: number[];
    activeSkinId: string;
    unlockedSkinIds: string[];
    version: number;
}

// Upgrade options
export interface Upgrade {
    id: string;
    name: string;
    cost: number;
    type: 'mult' | 'color' | 'weight' | 'shard';
    value: number | string;
    color: string;
    description?: string;
}
