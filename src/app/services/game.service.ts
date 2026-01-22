import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState, Sector, Joker, Amulet, RunStats, BlindType, BlindState } from '../models/game.model';

const STORAGE_KEY = 'neon_roulette_state';

const INITIAL_SECTORS: Sector[] = [
    { id: '1', label: '1x', color: '#1e1b4b', multiplier: 1, weight: 1 },
    { id: '2', label: '2x', color: '#312e81', multiplier: 2, weight: 1 },
    { id: '3', label: '1x', color: '#1e1b4b', multiplier: 1, weight: 1 },
    { id: '4', label: '5x', color: '#4338ca', multiplier: 5, weight: 1 },
    { id: '5', label: '1x', color: '#1e1b4b', multiplier: 1, weight: 1 },
    { id: '6', label: '2x', color: '#312e81', multiplier: 2, weight: 1 },
    { id: '7', label: '1x', color: '#1e1b4b', multiplier: 1, weight: 1 },
    { id: '8', label: '10x', color: '#ec4899', multiplier: 10, weight: 1 },
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
    isShopOpen: false
};

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private stateSubject = new BehaviorSubject<GameState>(INITIAL_STATE);
    public state$: Observable<GameState> = this.stateSubject.asObservable();

    constructor() {
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
            if (typeof state.chips !== 'number' || state.chips < 0) return null;
            if (!Array.isArray(state.sectors) || state.sectors.length === 0) return null;

            // Ensure all sectors have weight property (add default if missing for backwards compatibility)
            const sectorsWithWeight = state.sectors.map((s: any) => ({
                ...s,
                weight: s.weight || 1
            }));

            return {
                chips: Math.max(0, state.chips),
                sectors: sectorsWithWeight,
                currentAnte: state.currentAnte || 1,
                blindState: state.blindState || { ...INITIAL_BLIND_STATE },
                lastWin: state.lastWin || 0,
                jokers: state.jokers || [],
                amulets: state.amulets || [],
                runStats: state.runStats || { ...INITIAL_RUN_STATS },
                metaCurrency: state.metaCurrency || 0,
                isGameOver: state.isGameOver || false,
                isShopOpen: state.isShopOpen || false
            };
        } catch {
            return null;
        }
    }

    getCurrentState(): GameState {
        return this.stateSubject.value;
    }

    spin(targetIndex: number, winAmount: number): void {
        const currentState = this.stateSubject.value;
        const targetSector = currentState.sectors[targetIndex];

        // Apply joker effects to win amount
        let finalWinAmount = this.applyJokerEffects(winAmount, targetSector);

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

        const newState: GameState = {
            ...currentState,
            chips: Math.max(0, currentState.chips + finalWinAmount),
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

        // Check for victory or defeat
        if (updatedBlindState.currentScore >= updatedBlindState.targetScore) {
            // Round Won! But we wait for UI to handle transition
        } else if (updatedBlindState.spinsRemaining === 0) {
            newState.isGameOver = true;
        }

        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    bet(amount: number): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            chips: Math.max(0, currentState.chips - amount),
            lastWin: 0
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    /**
     * Development tool: Add chips directly to the state
     */
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

    // ========== NEW ROGUELIKE METHODS ==========

    /**
     * Select a random sector based on weights (higher weight = higher probability)
     */
    selectWeightedSector(): number {
        const currentState = this.stateSubject.value;
        const sectors = currentState.sectors;

        // Calculate total weight
        const totalWeight = sectors.reduce((sum, s) => sum + s.weight, 0);

        // Generate random number between 0 and totalWeight
        let random = Math.random() * totalWeight;

        // Find the sector that corresponds to this random value
        for (let i = 0; i < sectors.length; i++) {
            random -= sectors[i].weight;
            if (random <= 0) {
                return i;
            }
        }

        // Fallback (should never happen)
        return 0;
    }

    /**
     * Apply all active joker effects to the win amount
     */
    private applyJokerEffects(baseWinAmount: number, targetSector: Sector): number {
        const currentState = this.stateSubject.value;
        let finalAmount = baseWinAmount;

        for (const joker of currentState.jokers) {
            for (const effect of joker.effects) {
                switch (effect.type) {
                    case 'win_multiplier':
                        finalAmount *= effect.value;
                        break;
                    case 'sector_boost':
                        if (effect.targetSectorId === targetSector.id) {
                            finalAmount *= effect.value;
                        }
                        break;
                    case 'refund':
                        // This would be handled elsewhere (in the bet method)
                        break;
                    // Add more effect types as needed
                }
            }
        }

        return Math.floor(finalAmount);
    }

    /**
     * Increase the weight of a specific sector
     */
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

    /**
     * Add a joker to the current run
     */
    addJoker(joker: Joker): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            jokers: [...currentState.jokers, joker]
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    /**
     * Remove a joker from the current run
     */
    removeJoker(jokerId: string): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            jokers: currentState.jokers.filter(j => j.id !== jokerId)
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    /**
     * Add an amulet to the current run
     */
    addAmulet(amulet: Amulet): void {
        const currentState = this.stateSubject.value;
        const newState = {
            ...currentState,
            amulets: [...currentState.amulets, amulet]
        };
        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    /**
     * Check if the player can continue (has enough chips for minimum bet)
     */
    checkGameOver(minimumBet: number = 10): boolean {
        const currentState = this.stateSubject.value;
        return currentState.chips < minimumBet;
    }

    /**
     * End the current run and start a new one
     * Saves meta-currency and resets the game state
     */
    endRun(): void {
        const currentState = this.stateSubject.value;

        // Calculate meta-currency earned (10% of total winnings)
        const earnedMetaCurrency = Math.floor(currentState.runStats.totalWinnings * 0.1);

        // Create new run stats
        const newRunStats: RunStats = {
            runNumber: currentState.runStats.runNumber + 1,
            totalSpins: 0,
            highestWin: 0,
            totalWinnings: 0,
            sectorsHit: {},
            startingChips: 500
        };

        // Reset to initial state but keep meta-currency
        const newState: GameState = {
            ...INITIAL_STATE,
            runStats: newRunStats,
            metaCurrency: currentState.metaCurrency + earnedMetaCurrency,
            isGameOver: false
        };

        this.stateSubject.next(newState);
        this.saveState(newState);
    }

    /**
     * Start a new blind based on current progression
     */
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
        const anteMultiplier = Math.pow(1.5, nextAnte - 1);
        const typeMultiplier = nextType === 'SMALL' ? 1 : nextType === 'BIG' ? 1.5 : 3;

        const targetScore = Math.floor(baseScore * anteMultiplier * typeMultiplier);
        const reward = Math.floor(100 * anteMultiplier * (nextType === 'BOSS' ? 2 : 1));

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

    /**
     * Complete the current round, collect rewards and open shop
     */
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

    /**
     * Close the shop and proceed to next blind
     */
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
}
