import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService, AVAILABLE_SKINS } from '../../services/game.service';
import { TranslationService } from '../../services/translation.service';
import { GameState } from '../../models/game.model';

@Component({
    selector: 'app-skin-shop',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './skin-shop.component.html',
    styleUrls: ['./skin-shop.component.css']
})
export class SkinShopComponent {
    @Output() close = new EventEmitter<void>();

    gameState!: GameState;
    availableSkins = AVAILABLE_SKINS;

    constructor(
        private gameService: GameService,
        public translationService: TranslationService
    ) {
        this.gameService.state$.subscribe(state => {
            this.gameState = state;
        });
    }

    exchange(chips: number): void {
        this.gameService.exchangeChipsForShards(chips);
    }

    isUnlocked(skinId: string): boolean {
        return this.gameState.unlockedSkinIds.includes(skinId);
    }

    buy(skinId: string): void {
        this.gameService.buySkin(skinId);
    }

    equip(skinId: string): void {
        this.gameService.applySkin(skinId);
    }
}
