import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState, Sector, Joker, Amulet, RunStats, BlindType, BlindState, WheelSkin } from '../models/game.model';
import { JokerService } from './joker.service';

const STORAGE_KEY = 'neon_roulette_state';
const CURRENT_VERSION = 4;

export const AVAILABLE_SKINS: WheelSkin[] = [
    {
        id: 'default',
        name: 'Neon Blue',
        description: 'The standard high-tech look',
        price: 0,
        colors: ['#1e293b', '#312e81', '#334155', '#4338ca', '#000000', '#312e81', '#1e1b4b', '#ec4899'],
        borderColor: '#6366f1',
        pointerColor: '#f43f5e',
        isLocked: false
    },
    {
        id: 'classic',
        name: 'Classic Casino',
        description: 'Traditional Vegas style',
        price: 500,
        colors: ['#1a1a1a', '#e11d48', '#1a1a1a', '#e11d48', '#15803d', '#e11d48', '#1a1a1a', '#e11d48'],
        borderColor: '#f59e0b',
        pointerColor: '#ffffff',
        isLocked: true
    },
    {
        id: 'luxury',
        name: 'Gold & Ivory',
        description: 'For the high rollers',
        price: 2000,
        colors: ['#000000', '#d4af37', '#ffffff', '#d4af37', '#000000', '#d4af37', '#ffffff', '#d4af37'],
        borderColor: '#d4af37',
        pointerColor: '#aa8a2e',
        isLocked: true
    },
    {
        id: 'cyber',
        name: 'Cyberpunk',
        description: 'Night city vibes',
        price: 1200,
        colors: ['#0f172a', '#06b6d4', '#4c1d95', '#d946ef', '#000000', '#06b6d4', '#4c1d95', '#d946ef'],
        borderColor: '#22d3ee',
        pointerColor: '#fde047',
        isLocked: true
    },
    {
        id: 'inferno',
        name: 'Inferno',
        description: 'Smokin\' hot style',
        price: 5000,
        colors: ['#450a0a', '#991b1b', '#7f1d1d', '#dc2626', '#000000', '#991b1b', '#450a0a', '#fbbf24'],
        borderColor: '#ef4444',
        pointerColor: '#f59e0b',
        isLocked: true
    },
    {
        id: 'forest',
        name: 'Enchanted Forest',
        description: 'Mystical nature vibes',
        price: 8500,
        colors: ['#064e3b', '#059669', '#065f46', '#10b981', '#022c22', '#059669', '#064e3b', '#6ee7b7'],
        borderColor: '#10b981',
        pointerColor: '#34d399',
        isLocked: true
    },
    {
        id: 'synth',
        name: 'Synthwave Retro',
        description: '80s arcade aesthetic',
        price: 12500,
        colors: ['#2e1065', '#d946ef', '#4c1d95', '#a21caf', '#0f172a', '#d946ef', '#2e1065', '#22d3ee'],
        borderColor: '#f0abfc',
        pointerColor: '#22d3ee',
        isLocked: true
    },
    {
        id: 'void',
        name: 'Void Realm',
        description: 'Into the unknown',
        price: 16500,
        colors: ['#020617', '#1e1b4b', '#0f172a', '#312e81', '#000000', '#1e1b4b', '#020617', '#818cf8'],
        borderColor: '#6366f1',
        pointerColor: '#c084fc',
        isLocked: true
    },
    {
        id: 'divine',
        name: 'Celestial Divine',
        description: 'Ascended status',
        price: 20000,
        colors: ['#ffffff', '#fef3c7', '#fffbeb', '#fde68a', '#fafaf9', '#fef3c7', '#ffffff', '#fbbf24'],
        borderColor: '#fbbf24',
        pointerColor: '#d97706',
        isLocked: true
    }
];

const INITIAL_SECTORS: Sector[] = [
    { id: '1', label: '0x', color: '#1e293b', multiplier: 0, weight: 1, shardProbability: 0.01, shardAmount: 10 },
    { id: '2', label: '2x', color: '#312e81', multiplier: 2, weight: 1, shardProbability: 0.01, shardAmount: 10 },
    { id: '3', label: '0.5x', color: '#334155', multiplier: 0.5, weight: 1, shardProbability: 0.01, shardAmount: 10 },
    { id: '4', label: '5x', color: '#4338ca', multiplier: 5, weight: 1, shardProbability: 0.01, shardAmount: 10 },
    { id: '5', label: '💀', color: '#000000', multiplier: 0, weight: 1, isDeath: true, shardProbability: 0.01, shardAmount: 10 },
    { id: '6', label: '2x', color: '#312e81', multiplier: 2, weight: 1, shardProbability: 0.01, shardAmount: 10 },
    { id: '7', label: '1x', color: '#1e1b4b', multiplier: 1, weight: 1, shardProbability: 0.01, shardAmount: 10 },
    { id: '8', label: '10x', color: '#ec4899', multiplier: 10, weight: 1, shardProbability: 0.01, shardAmount: 10 },
];

const INITIAL_RUN_STATS: RunStats = {
    runNumber: 1,
    totalSpins: 0,
    highestWin: 0,
    totalWinnings: 0,
    sectorsHit: {},
    startingChips: 500
};

const INITIAL_BLIND_STATE: BlindState = {
    type: 'SMALL',
    targetScore: 300,
    currentScore: 0,
    spinsRemaining: 5,
    spinsTotal: 5,
    reward: 100
};

const INITIAL_STATE: GameState = {
    chips: 500,
    sectors: INITIAL_SECTORS,
    currentAnte: 1,
    blindState: INITIAL_BLIND_STATE,
    lastWin: 0,
    jokers: [],
    amulets: [],
    runStats: INITIAL_RUN_STATS,
    metaCurrency: 0,
    isGameOver: false,
    isShopOpen: false,
    selectedBet: 10,
    availableBets: [10, 20, 50, 100, 200, 500],
    activeSkinId: 'default',
    unlockedSkinIds: ['default'],
    version: CURRENT_VERSION
};

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private stateSubject = new BehaviorSubject<GameState>(INITIAL_STATE);
    public state$: Observable<GameState> = this.stateSubject.asObservable();

    constructor(private jokerService: JokerService) {
        this.loadState();
    }

    private loadState(): void {
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                const validatedState = this.validateGameState(parsedState);
                if (validatedState) {
                    this.stateSubject.next(validatedState);
                } else {
                    console.warn('Saved state is invalid, using default state');
                    localStorage.removeItem(STORAGE_KEY);
                }
            }
        } catch (e) {
            console.error('Failed to load game state', e);
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    private saveState(state: GameState): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save game state', e);
        }
    }

    private validateGameState(state: any): GameState | null {
        try {
            if (!state || typeof state !== 'object') return null;
            if (state.version !== CURRENT_VERSION) return null;
            if (typeof state.chips !== 'number' || state.chips < 0) return null;
            if (!Array.isArray(state.sectors) || state.sectors.length === 0) return null;

            const sectorsWithShardProb = state.sectors.map((s: any) => ({
                ...s,
                weight: s.weight || 1,
                shardProbability: s.shardProbability !== undefined ? s.shardProbability : 0.01,
                shardAmount: s.shardAmount || 10
            }));

            return {
                chips: Math.max(0, state.chips),
                sectors: sectorsWithShardProb,
                currentAnte: state.currentAnte || 1,
                blindState: state.blindState || { ...INITIAL_BLIND_STATE },
                lastWin: state.lastWin || 0,
                jokers: state.jokers || [],
                amulets: state.amulets || [],
                runStats: state.runStats || { ...INITIAL_RUN_STATS },
                metaCurrency: state.metaCurrency || 0,
                isGameOver: state.isGameOver || false,
                isShopOpen: state.isShopOpen || false,
                selectedBet: state.selectedBet || 10,
                availableBets: state.availableBets || [10, 20, 50, 100, 200, 500],
                activeSkinId: state.activeSkinId || 'default',
                unlockedSkinIds: state.unlockedSkinIds || ['default'],
                version: CURRENT_VERSION
            };
        } catch {
            return null;
        }
    }

    getCurrentState(): GameState {
        return this.stateSubject.value;
    }

    /**
     * Start the spin process: deduct bet, select target, and return it.
     */
    startSpin(): number | null {
        const currentState = this.stateSubject.value;
        const bet = currentState.selectedBet;

        if (currentState.chips < bet) return null;

        const targetIndex = this.selectWeightedSector();

        const newState: GameState = {
            ...currentState,
            chips: currentState.chips - bet,
            lastWin: 0
        };

        this.stateSubject.next(newState);
        this.saveState(newState);

        return targetIndex;
    }

    /**
     * Complete the spin process: calculate reward and add gems/stats.
     */
    spin(targetIndex: number): void {
        const currentState = this.stateSubject.value;
        const targetSector = currentState.sectors[targetIndex];

        // The bet was deducted in startSpin.
        const baseReward = currentState.selectedBet * targetSector.multiplier;

        // Apply all joker effects using the dedicated service
        const finalWinAmount = this.jokerService.applyJokerEffectsToWin(
            baseReward,
            currentState.jokers,
            targetSector.multiplier,
            currentState.selectedBet
        );

        // Update sector hit stats
        const updatedSectorsHit = {
            ...currentState.runStats.sectorsHit,
            [targetSector.id]: (currentState.runStats.sectorsHit[targetSector.id] || 0) + 1
        };

        // Update blind progress
        const updatedBlindState = {
            ...currentState.blindState,
            currentScore: currentState.blindState.currentScore + finalWinAmount,
            spinsRemaining: currentState.blindState.spinsRemaining - 1
        };

        // Shard Reward Logic
        let shardsEarned = 0;
        if (targetSector.shardProbability && Math.random() < targetSector.shardProbability) {
            shardsEarned = targetSector.shardAmount || 10;
        }

        const newState: GameState = {
            ...currentState,
            chips: Math.max(0, currentState.chips + finalWinAmount),
            metaCurrency: currentState.metaCurrency + shardsEarned,
            lastWin: finalWinAmount,
            blindState: updatedBlindState,
            runStats: {
                ...currentState.runStats,
                totalSpins: currentState.runStats.totalSpins + 1,
                highestWin: Math.max(currentState.runStats.highestWin, finalWinAmount),
                totalWinnings: currentState.runStats.totalWinnings + finalWinAmount,
                sectorsHit: updatedSectorsHit
            }
        };

        this.stateSubject.next(newState);
        this.saveState(newState);

        // Check for victory or defeat
        if (targetSector.isDeath) {
            this.setGameOver(true);
        } else if (updatedBlindState.spinsRemaining === 0 && updatedBlindState.currentScore < updatedBlindState.targetScore) {
            this.setGameOver(true);
        }
    }

    bet(amount: number): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            selectedBet: amount
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    spendChips(amount: number): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            chips: Math.max(0, currentState.chips - amount)
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    addChips(amount: number): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            chips: currentState.chips + amount
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    upgradeSector(id: string, multiplierAdd: number, color?: string): void {
        const currentState = this.stateSubject.value;
        const newSectors = currentState.sectors.map(s => {
            if (s.id === id) {
                const newMult = s.multiplier + multiplierAdd;
                return {
                    ...s,
                    multiplier: newMult,
                    label: `${newMult}x`,
                    color: color || s.color,
                    isCustomized: true
                };
            }
            return s;
        });
        const newState = {
            ...currentState,
            sectors: newSectors
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    resetWin(): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            lastWin: 0
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    selectWeightedSector(): number {
        const currentState = this.stateSubject.value;
        const sectors = currentState.sectors;
        const totalWeight = sectors.reduce((sum, s) => sum + s.weight, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < sectors.length; i++) {
            random -= sectors[i].weight;
            if (random <= 0) {
                return i;
            }
        }
        return 0;
    }
    increaseSectorWeight(id: string, weightIncrease: number = 1): void {
        const currentState = this.stateSubject.value;
        const newSectors = currentState.sectors.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    weight: s.weight + weightIncrease,
                    isCustomized: true
                };
            }
            return s;
        });
        const newState = {
            ...currentState,
            sectors: newSectors
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    upgradeSectorShardProb(id: string, probIncrease: number = 0.005): void {
        const currentState = this.stateSubject.value;
        const newSectors = currentState.sectors.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    shardProbability: (s.shardProbability || 0) + probIncrease,
                    isCustomized: true
                };
            }
            return s;
        });
        const newState = {
            ...currentState,
            sectors: newSectors
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    addJoker(joker: Joker): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            jokers: [...currentState.jokers, joker]
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    removeJoker(jokerId: string): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            jokers: currentState.jokers.filter(j => j.id !== jokerId)
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    addAmulet(amulet: Amulet): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            amulets: [...currentState.amulets, amulet]
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    checkGameOver(minimumBet: number = 10): boolean {
        return this.stateSubject.value.chips < minimumBet;
    }

    endRun(): void {
        const currentState = this.stateSubject.value;
        const earnedMetaCurrency = Math.floor(currentState.runStats.totalWinnings * 0.1);
        const newRunStats: RunStats = {
            runNumber: currentState.runStats.runNumber + 1,
            totalSpins: 0,
            highestWin: 0,
            totalWinnings: 0,
            sectorsHit: {},
            startingChips: 500
        };
        const newState: GameState = {
            ...INITIAL_STATE,
            runStats: newRunStats,
            metaCurrency: currentState.metaCurrency + earnedMetaCurrency,
            isGameOver: false
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    nextBlind(): void {
        const currentState = this.stateSubject.value;
        let nextType: BlindType = 'SMALL';
        let nextAnte = currentState.currentAnte;

        if (currentState.blindState.type === 'SMALL') {
            nextType = 'BIG';
        } else if (currentState.blindState.type === 'BIG') {
            nextType = 'BOSS';
        } else {
            nextType = 'SMALL';
            nextAnte++;
        }

        const baseScore = 300;
        const blindProgressionCount = (currentState.currentAnte - 1) * 3 +
            (currentState.blindState.type === 'SMALL' ? 1 : currentState.blindState.type === 'BIG' ? 2 : 3);

        const progressionMultiplier = Math.pow(1.4, blindProgressionCount);
        const targetScore = Math.floor(baseScore * progressionMultiplier);
        const reward = Math.floor(100 * Math.pow(1.5, nextAnte - 1) * (nextType === 'BOSS' ? 2 : 1));

        const newBlindState: BlindState = {
            type: nextType,
            targetScore,
            currentScore: 0,
            spinsRemaining: 5,
            spinsTotal: 5,
            reward
        };

        const newState: GameState = {
            ...currentState,
            currentAnte: nextAnte,
            blindState: newBlindState,
            isShopOpen: false,
            lastWin: 0
        };

        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    completeRound(): void {
        const currentState = this.stateSubject.value;
        const newState: GameState = {
            ...currentState,
            chips: currentState.chips + currentState.blindState.reward,
            isShopOpen: true
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    closeShop(): void {
        const currentState = this.stateSubject.value;
        const newState: GameState = {
            ...currentState,
            isShopOpen: false
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
        this.nextBlind();
    }

    setGameOver(isOver: boolean): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            isGameOver: isOver
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    exchangeChipsForShards(chipsAmount: number): boolean {
        const currentState = this.stateSubject.value;
        if (chipsAmount <= 0 || currentState.chips < chipsAmount) return false;

        const shardsEarned = Math.floor(chipsAmount / 100);
        const newState: GameState = {
            ...currentState,
            chips: currentState.chips - chipsAmount,
            metaCurrency: currentState.metaCurrency + shardsEarned
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
        return true;
    }

    buySkin(skinId: string): boolean {
        const currentState = this.stateSubject.value;
        const skin = AVAILABLE_SKINS.find(s => s.id === skinId);
        if (!skin || currentState.unlockedSkinIds.includes(skinId)) return false;

        if (currentState.metaCurrency >= skin.price) {
            const newState: GameState = {
                ...currentState,
                metaCurrency: currentState.metaCurrency - skin.price,
                unlockedSkinIds: [...currentState.unlockedSkinIds, skinId],
                activeSkinId: skinId
            };
            this.stateSubject.next(newState);
            this.saveState(newState);
            this.applySkinToSectors(skinId);
            return true;
        }
        return false;
    }

    applySkin(skinId: string): void {
        const currentState = this.stateSubject.value;
        if (currentState.unlockedSkinIds.includes(skinId)) {
            const newState = {
                ...currentState,
                activeSkinId: skinId
            };
            this.stateSubject.next(newState);
            this.saveState(newState);
            this.applySkinToSectors(skinId);
        }
    }

    rerollWheel(): boolean {
        const currentState = this.stateSubject.value;
        const REROLL_COST = 1000;
        if (currentState.chips < REROLL_COST) return false;

        const multPool = [0, 0.5, 1, 1, 2, 2, 5, 10];
        const shuffledMults = [...multPool].sort(() => Math.random() - 0.5);

        const freshSectors: Sector[] = shuffledMults.map((mult, i) => ({
            id: `fresh_${Date.now()}_${i}`,
            label: mult === 0 ? '0x' : `${mult}x`,
            multiplier: mult,
            color: mult >= 5 ? '#ec4899' : (mult >= 2 ? '#312e81' : '#1e293b'),
            weight: 1,
            shardProbability: 0.01,
            shardAmount: 10
        }));

        const deathIndex = Math.floor(Math.random() * freshSectors.length);
        if (freshSectors[deathIndex].multiplier === 0) {
            freshSectors[deathIndex].label = '💀';
            freshSectors[deathIndex].isDeath = true;
            freshSectors[deathIndex].color = '#000000';
        }

        const newState: GameState = {
            ...currentState,
            chips: currentState.chips - REROLL_COST,
            sectors: freshSectors
        };

        this.stateSubject.next(newState);
        this.saveState(newState);
        this.applySkinToSectors(currentState.activeSkinId);
        return true;
    }

    private applySkinToSectors(skinId: string): void {
        const skin = AVAILABLE_SKINS.find(s => s.id === skinId);
        if (!skin) return;

        const currentState = this.stateSubject.value;
        const newSectors = currentState.sectors.map((s, i) => ({
            ...s,
            color: skin.colors[i % skin.colors.length] || s.color
        }));

        const newState = {
            ...currentState,
            sectors: newSectors
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }
}
