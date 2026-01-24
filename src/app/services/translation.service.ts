import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en' | 'es';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private currentLang = new BehaviorSubject<Language>('es'); // Default to Spanish as per user preference
    public currentLang$ = this.currentLang.asObservable();

    private translations: any = {
        en: {
            TITLE: 'NEON ROULETTE',
            CHIPS: 'Chips',
            SHARDS: 'Shards',
            ANTE: 'ANTE',
            SMALL_BLIND: 'SMALL BLIND',
            BIG_BLIND: 'BIG BLIND',
            BOSS_BLIND: 'BOSS BLIND',
            SCORE: 'Score',
            TARGET: 'Target',
            SPINS_LEFT: 'SPINS LEFT',
            SPIN: 'SPIN',
            UPGRADE_SECTOR: 'Upgrade Sector',
            NEW_WHEEL: 'New Wheel',
            SHOP_TITLE: 'WHEEL MODIFIER',
            SELECT_SECTOR: 'Select a Sector to Upgrade:',
            SELECTED: 'SELECTED:',
            WEIGHT: 'Weight',
            SHARD_PROB: 'Shard Chance',
            AVAILABLE_UPGRADES: 'Available Upgrades:',
            PICK_SLICE: 'Pick a slice of the wheel above to start modifying',
            BUY: 'BUY',
            COST: 'Chips',
            CLOSE: '✕',
            GAME_OVER: 'GAME OVER',
            RUN: 'RUN',
            TOTAL_SPINS: 'Total Spins',
            HIGHEST_WIN: 'Highest Win',
            TOTAL_WINNINGS: 'Total Winnings',
            RESTART: 'RESTART RUN',
            JOKER_SHOP: 'JOKER SHOP',
            SELECT_BET: 'SELECT YOUR BET',
            AVAILABLE_JOKERS: 'Available Jokers:',
            FULL: 'FULL',
            TOO_EXPENSIVE: 'TOO EXPENSIVE',
            REFRESH_SHOP: 'Refresh Shop (Free)',
            MAX_JOKERS_WARNING: '⚠️ You have maximum jokers! Remove one to buy more.',
            RUN_OVER: 'RUN OVER',
            RUN_NUMBER: 'Run',
            META_PROGRESSION: 'Meta-Progression',
            SHARDS_EARNED: 'Neon Shards Earned',
            SHARDS_DESC: 'Neon Shards persist across runs and are used for permanent upgrades.',
            COLLECT_NEW_RUN: 'COLLECT & NEW RUN'
        },
        es: {
            TITLE: 'RULETA NEÓN',
            CHIPS: 'Fichas',
            SHARDS: 'Fragmentos',
            ANTE: 'ANTE',
            SMALL_BLIND: 'CIEGA PEQUEÑA',
            BIG_BLIND: 'CIEGA GRANDE',
            BOSS_BLIND: 'CIEGA JEFE',
            SCORE: 'Puntos',
            TARGET: 'Objetivo',
            SPINS_LEFT: 'GIROS RESTANTES',
            SPIN: 'GIRAR',
            UPGRADE_SECTOR: 'Mejorar Sector',
            NEW_WHEEL: 'Nueva Rueda',
            SHOP_TITLE: 'MODIFICADOR DE RUEDA',
            SELECT_SECTOR: 'Selecciona un Sector para Mejorar:',
            SELECTED: 'SELECCIONADO:',
            WEIGHT: 'Probabilidad',
            SHARD_PROB: 'Prob. Fragmentos',
            AVAILABLE_UPGRADES: 'Mejoras Disponibles:',
            PICK_SLICE: 'Elige una porción de la rueda para empezar a modificar',
            BUY: 'COMPRAR',
            COST: 'Fichas',
            CLOSE: '✕',
            GAME_OVER: 'FIN DE LA PARTIDA',
            RUN: 'PARTIDA',
            TOTAL_SPINS: 'Giros Totales',
            HIGHEST_WIN: 'Mayor Premio',
            TOTAL_WINNINGS: 'Ganancias Totales',
            RESTART: 'REINICIAR RUN',
            JOKER_SHOP: 'TIENDA DE JOKERS',
            SELECT_BET: 'ELIGE TU APUESTA',
            AVAILABLE_JOKERS: 'Jokers Disponibles:',
            FULL: 'LLENO',
            TOO_EXPENSIVE: 'MUY CARO',
            REFRESH_SHOP: 'Renovar Tienda (Gratis)',
            MAX_JOKERS_WARNING: '⚠️ ¡Tienes el máximo de jokers! Elimina uno para comprar más.',
            RUN_OVER: 'PARTIDA FINALIZADA',
            RUN_NUMBER: 'Partida',
            META_PROGRESSION: 'Meta-Progresión',
            SHARDS_EARNED: 'Fragmentos Neón Ganados',
            SHARDS_DESC: 'Los Fragmentos Neón persisten entre partidas y sirven para mejoras permanentes.',
            COLLECT_NEW_RUN: 'COBRAR Y NUEVA PARTIDA'
        }
    };

    translate(key: string): string {
        return this.translations[this.currentLang.value][key] || key;
    }

    setLanguage(lang: Language): void {
        this.currentLang.next(lang);
    }

    getLanguage(): Language {
        return this.currentLang.value;
    }

    toggleLanguage(): void {
        this.setLanguage(this.currentLang.value === 'en' ? 'es' : 'en');
    }
}
