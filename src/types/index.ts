export interface Sector {
    id: string;
    label: string;
    color: string;
    multiplier: number;
    weight: number;
    isCustomized?: boolean;
}

export type BlindType = 'SMALL' | 'BIG' | 'BOSS';

export interface BlindState {
    type: BlindType;
    targetScore: number;
    currentScore: number;
    spinsRemaining: number;
    spinsTotal: number;
    reward: number;
}

export interface GameState {
    chips: number;
    sectors: Sector[];
    currentAnte: number;
    blindState: BlindState;
    lastWin: number;
    isGameOver: boolean;
    isShopOpen: boolean;
}

export interface GameContextType extends GameState {
    spin: (targetIndex: number, winAmount: number) => void;
    bet: (amount: number) => void;
    upgradeSector: (id: string, multiplierAdd: number, color?: string) => void;
    resetWin: () => void;
}
