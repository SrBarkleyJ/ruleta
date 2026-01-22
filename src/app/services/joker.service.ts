import { Injectable } from '@angular/core';
import { Joker, JokerEffect } from '../models/game.model';

/**
 * Complete catalog of all available jokers with their effects and mechanics
 */
const JOKER_CATALOG: Joker[] = [
    // ========== COMMON TIER (5 jokers) ==========
    {
        id: 'lucky_charm',
        name: 'Lucky Charm',
        description: '+15% chance to hit high multiplier sectors (5x+)',
        effects: [
            { type: 'weight_bonus', value: 0.15, targetSectorId: undefined }
        ],
        rarity: 'common',
        cost: 100,
        icon: 'assets/luckyCharm.png',
        isUnlocked: true
    },
    {
        id: 'chip_magnet',
        name: 'Chip Magnet',
        description: 'Earn 5 bonus chips after every spin',
        effects: [
            { type: 'chip_generation', value: 5 }
        ],
        rarity: 'common',
        cost: 80,
        icon: 'assets/chipMagnet.png',
        isUnlocked: true
    },
    {
        id: 'penny_saver',
        name: 'Penny Saver',
        description: 'Refund 25% of bet if you win less than bet amount',
        effects: [
            { type: 'refund', value: 0.25 }
        ],
        rarity: 'common',
        cost: 90,
        icon: 'assets/pennySaver.png',
        isUnlocked: true
    },
    {
        id: 'recycler',
        name: 'Recycler',
        description: 'Get 3 chips back on every losing spin',
        effects: [
            { type: 'refund', value: 3 }
        ],
        rarity: 'common',
        cost: 75,
        icon: 'assets/recycler.png',
        isUnlocked: true
    },
    {
        id: 'extra_spin',
        name: 'Extra Spin',
        description: 'Reduce spin cost by 2 chips (minimum 1)',
        effects: [
            { type: 'chip_generation', value: 2 }
        ],
        rarity: 'common',
        cost: 110,
        icon: 'assets/extraSpin.png',
        isUnlocked: true
    },

    // ========== UNCOMMON TIER (4 jokers) ==========
    {
        id: 'sector_lover',
        name: 'Sector Lover',
        description: 'Choose a sector: it gives +2x multiplier',
        effects: [
            { type: 'sector_boost', value: 2, targetSectorId: undefined }
        ],
        rarity: 'uncommon',
        cost: 200,
        icon: 'assets/sectorLover.png',
        isUnlocked: true
    },
    {
        id: 'double_trouble',
        name: 'Double Trouble',
        description: '20% chance to double your winnings',
        effects: [
            { type: 'win_multiplier', value: 2 }
        ],
        rarity: 'uncommon',
        cost: 250,
        icon: 'assets/doubleTrouble.png',
        isUnlocked: true
    },
    {
        id: 'win_streak',
        name: 'Win Streak',
        description: '+10% winnings for each consecutive win (max 50%)',
        effects: [
            { type: 'win_multiplier', value: 1.1 }
        ],
        rarity: 'uncommon',
        cost: 220,
        icon: 'assets/winStreak.png',
        isUnlocked: true
    },
    {
        id: 'risk_taker',
        name: 'Risk Taker',
        description: 'Bet costs +5 but all winnings are tripled',
        effects: [
            { type: 'win_multiplier', value: 3 }
        ],
        rarity: 'uncommon',
        cost: 280,
        icon: 'assets/riskTaker.png',
        isUnlocked: true
    },

    // ========== RARE TIER (4 jokers) ==========
    {
        id: 'multiplier_master',
        name: 'Multiplier Master',
        description: 'All sectors with 5x+ get an additional +3x',
        effects: [
            { type: 'sector_boost', value: 3 }
        ],
        rarity: 'rare',
        cost: 400,
        icon: 'assets/multiplierMaster.png',
        isUnlocked: true
    },
    {
        id: 'golden_touch',
        name: 'Golden Touch',
        description: 'First spin of each session always wins 50 chips',
        effects: [
            { type: 'chip_generation', value: 50 }
        ],
        rarity: 'rare',
        cost: 350,
        icon: 'assets/goldenTouch.png',
        isUnlocked: true
    },
    {
        id: 'probability_bender',
        name: 'Probability Bender',
        description: 'All sectors you\'ve upgraded gain +1 weight',
        effects: [
            { type: 'weight_bonus', value: 1 }
        ],
        rarity: 'rare',
        cost: 450,
        icon: 'assets/probabilityBender.png',
        isUnlocked: true
    },
    {
        id: 'chain_reactor',
        name: 'Chain Reactor',
        description: 'Each win adds +5% to next win (resets on loss)',
        effects: [
            { type: 'win_multiplier', value: 1.05 }
        ],
        rarity: 'rare',
        cost: 420,
        icon: 'assets/chainReactor.png',
        isUnlocked: true
    },

    // ========== LEGENDARY TIER (2 jokers) ==========
    {
        id: 'midas_wheel',
        name: 'Midas Wheel',
        description: 'All 1x sectors become 2x, all 2x become 5x',
        effects: [
            { type: 'sector_boost', value: 1 }
        ],
        rarity: 'legendary',
        cost: 800,
        icon: 'assets/midasWheel.png',
        isUnlocked: false // Must be unlocked
    },
    {
        id: 'infinity_joker',
        name: 'Infinity Joker',
        description: 'ULTIMATE: All winnings are multiplied by 5',
        effects: [
            { type: 'win_multiplier', value: 5 }
        ],
        rarity: 'legendary',
        cost: 1000,
        icon: 'assets/infinityJoker.png',
        isUnlocked: false // Must be unlocked
    }
];

@Injectable({
    providedIn: 'root'
})
export class JokerService {
    private jokerCatalog: Joker[] = JOKER_CATALOG;

    constructor() { }

    /**
     * Get all available jokers (unlocked only)
     */
    getAvailableJokers(): Joker[] {
        return this.jokerCatalog.filter(j => j.isUnlocked);
    }

    /**
     * Get all jokers (including locked)
     */
    getAllJokers(): Joker[] {
        return this.jokerCatalog;
    }

    /**
     * Get joker by ID
     */
    getJokerById(id: string): Joker | undefined {
        return this.jokerCatalog.find(j => j.id === id);
    }

    /**
     * Get jokers by rarity
     */
    getJokersByRarity(rarity: 'common' | 'uncommon' | 'rare' | 'legendary'): Joker[] {
        return this.jokerCatalog.filter(j => j.rarity === rarity && j.isUnlocked);
    }

    /**
     * Unlock a joker (for progression system)
     */
    unlockJoker(id: string): void {
        const joker = this.getJokerById(id);
        if (joker) {
            joker.isUnlocked = true;
        }
    }

    /**
     * Get random jokers for shop (3 random available jokers)
     */
    getRandomShopJokers(count: number = 3): Joker[] {
        const available = this.getAvailableJokers();
        const shuffled = [...available].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * Apply joker effects to calculate final win amount
     * This is called by GameService when processing a spin
     */
    applyJokerEffectsToWin(
        baseWinAmount: number,
        activeJokers: Joker[],
        targetSectorMultiplier: number,
        betAmount: number
    ): number {
        let finalAmount = baseWinAmount;
        let hasWinMultipliers = false;

        for (const joker of activeJokers) {
            for (const effect of joker.effects) {
                switch (effect.type) {
                    case 'win_multiplier':
                        // Multiply the win amount
                        finalAmount *= effect.value;
                        hasWinMultipliers = true;
                        break;

                    case 'sector_boost':
                        // Boost is already applied in GameService.spin()
                        // This is just for reference
                        break;

                    case 'chip_generation':
                        // Add flat chips
                        finalAmount += effect.value;
                        break;

                    case 'refund':
                        // Handle refund logic (if win < bet)
                        if (baseWinAmount < betAmount) {
                            finalAmount += betAmount * effect.value;
                        }
                        break;
                }
            }
        }

        return Math.floor(finalAmount);
    }

    /**
     * Calculate sector multiplier boost from jokers
     * Called before spinning to adjust sector multipliers
     */
    calculateSectorBoost(
        sectorId: string,
        baseMultiplier: number,
        activeJokers: Joker[]
    ): number {
        let boost = 0;

        for (const joker of activeJokers) {
            for (const effect of joker.effects) {
                if (effect.type === 'sector_boost') {
                    // Specific sector target
                    if (effect.targetSectorId === sectorId) {
                        boost += effect.value;
                    }
                    // Or boost all high multipliers (Multiplier Master)
                    else if (!effect.targetSectorId && baseMultiplier >= 5) {
                        boost += effect.value;
                    }
                }
            }
        }

        return boost;
    }

    /**
     * Calculate weight bonus from jokers
     */
    calculateWeightBonus(
        sectorId: string,
        isCustomized: boolean,
        activeJokers: Joker[]
    ): number {
        let bonus = 0;

        for (const joker of activeJokers) {
            // Probability Bender: boost customized sectors
            if (joker.id === 'probability_bender' && isCustomized) {
                bonus += 1;
            }

            // Lucky Charm: handled in GameService
        }

        return bonus;
    }
}
