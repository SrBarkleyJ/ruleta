import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { RouletteWheelComponent } from '../roulette-wheel/roulette-wheel.component';
import { UpgradeShopComponent } from '../upgrade-shop/upgrade-shop.component';
import { JokerShopComponent } from '../joker-shop/joker-shop.component';
import { GameOverModalComponent } from '../game-over-modal/game-over-modal.component';
import { GameState } from '../../models/game.model';

@Component({
    selector: 'app-game-screen',
    standalone: true,
    imports: [CommonModule, RouletteWheelComponent, UpgradeShopComponent, JokerShopComponent, GameOverModalComponent],
    templateUrl: './game-screen.component.html',
    styleUrls: ['./game-screen.component.css']
})
export class GameScreenComponent {
    @ViewChild(RouletteWheelComponent) wheelComponent!: RouletteWheelComponent;

    gameState!: GameState;
    isSpinning = false;
    isJokerShopVisible = false;
    showWinAnimation = false;

    constructor(public gameService: GameService) {
        this.gameService.state$.subscribe(state => {
            this.gameState = state;
        });
    }

    handleSpin(): void {
        if (this.isSpinning || (this.gameState.blindState.spinsRemaining || 0) <= 0) return;

        this.isSpinning = true;
        this.gameService.bet(10);
        this.gameService.resetWin();
        this.showWinAnimation = false;

        // Use weighted sector selection
        const targetSectorIndex = this.gameService.selectWeightedSector();
        this.wheelComponent.spinToSector(targetSectorIndex);
    }

    onSpinComplete(sectorIndex: number): void {
        this.isSpinning = false;
        const sector = this.gameState.sectors[sectorIndex];
        const winAmount = 10 * sector.multiplier;

        this.gameService.spin(sectorIndex, winAmount);
        this.showWinAnimation = true;

        // Shake effect for big wins
        if (winAmount >= 50) {
            const container = document.querySelector('.game-container');
            container?.classList.add('shake');
            setTimeout(() => {
                container?.classList.remove('shake');
            }, 500);
        }

        // Check for round win or game over
        setTimeout(() => {
            this.showWinAnimation = false;

            if (this.gameState.blindState.currentScore >= this.gameState.blindState.targetScore) {
                // Round Won! transition to shop
                this.gameService.completeRound();
            } else if (this.gameState.blindState.spinsRemaining === 0) {
                this.gameService.setGameOver(true);
            }
        }, 2000);
    }

    openShop(): void {
        // Manual shop opening for debugging if needed, 
        // but normally it opens automatically
        this.gameService.completeRound();
    }

    closeShop(): void {
        this.gameService.closeShop();
    }

    // Joker management
    readonly MAX_JOKERS = 5;

    getEmptySlots(): number[] {
        const jokerCount = this.gameState?.jokers?.length || 0;
        const emptyCount = Math.max(0, this.MAX_JOKERS - jokerCount);
        return Array(emptyCount).fill(0).map((_, i) => i);
    }

    openJokerShop(): void {
        this.isJokerShopVisible = true;
    }

    closeJokerShop(): void {
        this.isJokerShopVisible = false;
    }

    onJokerPurchased(): void {
        // Joker was purchased, modal will close automatically
        console.log('Joker purchased!');
    }

    addWinningChips(): void {
        this.gameService.addChips(1000);
    }

    closeGameOver(): void {
        // Run end logic is already handled in endRun() within the modal
        // This just ensures the local UI state is clean if needed
    }
}
