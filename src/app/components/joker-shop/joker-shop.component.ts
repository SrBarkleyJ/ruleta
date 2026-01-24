import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { JokerService } from '../../services/joker.service';
import { TranslationService } from '../../services/translation.service';
import { Joker } from '../../models/game.model';

@Component({
  selector: 'app-joker-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './joker-shop.component.html',
  styleUrls: ['./joker-shop.component.css']
})
export class JokerShopComponent implements OnInit {
  @Input() visible = false;
  @Input() chips = 0;
  @Input() activeJokerCount = 0;
  @Output() close = new EventEmitter<void>();
  @Output() jokerPurchased = new EventEmitter<Joker>();

  readonly MAX_JOKERS = 5;
  shopJokers: Joker[] = [];
  selectedJoker: Joker | null = null;

  constructor(
    private gameService: GameService,
    private jokerService: JokerService,
    public translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.refreshShop();
  }

  ngOnChanges(): void {
    if (this.visible) {
      this.refreshShop();
    }
  }

  refreshShop(): void {
    this.shopJokers = this.jokerService.getRandomShopJokers(3);
  }

  selectJoker(joker: Joker): void {
    this.selectedJoker = joker;
  }

  canBuyJoker(joker: Joker): boolean {
    return this.chips >= joker.cost && this.activeJokerCount < this.MAX_JOKERS;
  }

  buyJoker(joker: Joker): void {
    if (!this.canBuyJoker(joker)) return;

    // Deduct chips
    this.gameService.bet(joker.cost);

    // Add joker to active jokers
    this.gameService.addJoker(joker);

    // Emit event
    this.jokerPurchased.emit(joker);

    // Close modal
    this.closeModal();
  }

  closeModal(): void {
    this.selectedJoker = null;
    this.close.emit();
  }

  getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return '#9ca3af';
      case 'uncommon': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'legendary': return '#fbbf24';
      default: return '#9ca3af';
    }
  }

  getRarityLabel(rarity: string): string {
    return rarity.toUpperCase();
  }
}
