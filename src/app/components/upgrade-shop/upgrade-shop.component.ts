import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { TranslationService } from '../../services/translation.service';
import { Sector, Upgrade } from '../../models/game.model';

const UPGRADES: Upgrade[] = [
    { id: 'mult_1', name: '+1 Multiplier', cost: 50, type: 'mult', value: 1, color: '#a855f7', description: 'Increase sector multiplier by 1x' },
    { id: 'mult_5', name: '+5 Multiplier', cost: 200, type: 'mult', value: 5, color: '#fbbf24', description: 'Increase sector multiplier by 5x' },
    { id: 'weight_1', name: '+1 Weight', cost: 75, type: 'weight', value: 1, color: '#06b6d4', description: 'Increase chance to hit this sector' },
    { id: 'weight_2', name: '+2 Weight', cost: 150, type: 'weight', value: 2, color: '#06b6d4', description: 'Greatly increase chance to hit this sector' },
    { id: 'shard_1', name: '+0.5% Shards', cost: 200, type: 'shard', value: 0.005, color: '#38bdf8', description: 'Increase chance to earn 10 permanent shards' },
    { id: 'color_pink', name: 'Neon Pink', cost: 30, type: 'color', value: '#ec4899', color: '#ec4899', description: 'Give sector a neon pink glow' },
    { id: 'color_cyan', name: 'Neon Cyan', cost: 30, type: 'color', value: '#a855f7', color: '#a855f7', description: 'Give sector a neon purple glow' },
    { id: 'color_gold', name: 'Golden Polish', cost: 100, type: 'color', value: '#fbbf24', color: '#fbbf24', description: 'Give sector a golden shine' },
];

@Component({
    selector: 'app-upgrade-shop',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './upgrade-shop.component.html',
    styleUrls: ['./upgrade-shop.component.css']
})
export class UpgradeShopComponent {
    @Input() visible = false;
    @Input() sectors: Sector[] = [];
    @Input() chips = 0;
    @Output() close = new EventEmitter<void>();

    selectedSector: Sector | null = null;
    upgrades = UPGRADES;
    wheelSize = 260;
    radius = 130;

    constructor(
        private gameService: GameService,
        public translationService: TranslationService
    ) { }

    private get totalWeight(): number {
        return this.sectors.reduce((sum, s) => sum + (s.weight || 1), 0);
    }

    private getSectorAnglesList(): { start: number, end: number, center: number }[] {
        const totalSectors = this.sectors.length || 1;
        const sweep = 360 / totalSectors;
        return this.sectors.map((_, i) => {
            const start = i * sweep;
            const end = (i + 1) * sweep;
            const center = start + (sweep / 2);
            return { start, end, center };
        });
    }

    getSectorPath(index: number): string {
        const angles = this.getSectorAnglesList()[index];
        if (!angles) return '';

        const { start: startAngle, end: endAngle } = angles;
        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);

        const x1 = this.radius + this.radius * Math.cos(startRad);
        const y1 = this.radius + this.radius * Math.sin(startRad);
        const x2 = this.radius + this.radius * Math.cos(endRad);
        const y2 = this.radius + this.radius * Math.sin(endRad);

        const sweepAngle = endAngle - startAngle;
        const largeArcFlag = sweepAngle > 180 ? 1 : 0;

        return `M ${this.radius} ${this.radius} L ${x1} ${y1} A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    }

    getLabelPosition(index: number): { x: number, y: number, rotation: number } {
        const angles = this.getSectorAnglesList()[index];
        if (!angles) return { x: 0, y: 0, rotation: 0 };

        const labelAngle = angles.center;
        const labelRad = (labelAngle - 90) * (Math.PI / 180);
        const labelX = this.radius + (this.radius * 0.7) * Math.cos(labelRad);
        const labelY = this.radius + (this.radius * 0.7) * Math.sin(labelRad);

        return { x: labelX, y: labelY, rotation: labelAngle };
    }

    selectSector(sector: Sector): void {
        this.selectedSector = sector;
    }

    buyUpgrade(upgrade: Upgrade): void {
        if (!this.selectedSector) return;

        // Check if sector already has this color
        if (upgrade.type === 'color' && this.selectedSector.color === upgrade.value) {
            return;
        }

        if (this.chips < upgrade.cost) {
            return;
        }

        this.gameService.spendChips(upgrade.cost);

        if (upgrade.type === 'mult') {
            this.gameService.upgradeSector(this.selectedSector.id, upgrade.value as number);
        } else if (upgrade.type === 'weight') {
            this.gameService.increaseSectorWeight(this.selectedSector.id, upgrade.value as number);
        } else if (upgrade.type === 'shard') {
            this.gameService.upgradeSectorShardProb(this.selectedSector.id, upgrade.value as number);
        } else {
            this.gameService.upgradeSector(this.selectedSector.id, 0, upgrade.value as string);
        }

    }

    closeModal(): void {
        this.selectedSector = null;
        this.close.emit();
    }

    hexToRgba(hex: string, alpha: number = 0.15): string {
        const hexValue = hex.replace('#', '');
        const r = parseInt(hexValue.substring(0, 2), 16);
        const g = parseInt(hexValue.substring(2, 4), 16);
        const b = parseInt(hexValue.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    canBuy(upgrade: Upgrade): boolean {
        return this.chips >= upgrade.cost;
    }
}
