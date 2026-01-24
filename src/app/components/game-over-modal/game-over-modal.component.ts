import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunStats } from '../../models/game.model';
import { GameService } from '../../services/game.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-game-over-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-over-modal.component.html',
  styleUrls: ['./game-over-modal.component.css']
})
export class GameOverModalComponent {
  @Input() stats!: RunStats;
  @Input() visible: boolean = false;
  @Output() restart = new EventEmitter<void>();

  constructor(
    private gameService: GameService,
    public translationService: TranslationService
  ) { }

  get metaCurrencyEarned(): number {
    return Math.floor(this.stats.totalWinnings * 0.1);
  }

  endRun(): void {
    this.gameService.endRun();
    this.restart.emit();
  }
}
