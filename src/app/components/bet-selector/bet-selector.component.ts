import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { TranslationService } from '../../services/translation.service';

@Component({
    selector: 'app-bet-selector',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bet-selector.component.html',
    styleUrls: ['./bet-selector.component.css']
})
export class BetSelectorComponent {
    constructor(
        public gameService: GameService,
        public translationService: TranslationService
    ) { }

    selectBet(amount: number): void {
        this.gameService.bet(amount);
    }
}
