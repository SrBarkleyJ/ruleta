import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector } from '../../models/game.model';

@Component({
    selector: 'app-roulette-wheel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './roulette-wheel.component.html',
    styleUrls: ['./roulette-wheel.component.css']
})
export class RouletteWheelComponent {
    @Input() sectors: Sector[] = [];
    @Output() spinComplete = new EventEmitter<number>();

    wheelSize = 300;
    radius = 150;
    rotation = 0;
    isSpinning = false;

    getSectorPath(index: number): string {
        const numSectors = this.sectors.length;
        const anglePerSector = 360 / numSectors;
        const startAngle = index * anglePerSector;
        const endAngle = (index + 1) * anglePerSector;

        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);

        const x1 = this.radius + this.radius * Math.cos(startRad);
        const y1 = this.radius + this.radius * Math.sin(startRad);
        const x2 = this.radius + this.radius * Math.cos(endRad);
        const y2 = this.radius + this.radius * Math.sin(endRad);

        const largeArcFlag = anglePerSector > 180 ? 1 : 0;

        return `M ${this.radius} ${this.radius} L ${x1} ${y1} A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    }

    getLabelPosition(index: number): { x: number, y: number, rotation: number } {
        const numSectors = this.sectors.length;
        const anglePerSector = 360 / numSectors;
        const labelAngle = index * anglePerSector + anglePerSector / 2;
        const labelRad = (labelAngle - 90) * (Math.PI / 180);
        const labelX = this.radius + (this.radius * 0.7) * Math.cos(labelRad);
        const labelY = this.radius + (this.radius * 0.7) * Math.sin(labelRad);

        return { x: labelX, y: labelY, rotation: labelAngle };
    }

    spinToSector(targetIndex: number): void {
        if (this.isSpinning) return;

        this.isSpinning = true;

        // Calculate the angle for the target sector
        const sectorAngle = 360 / this.sectors.length;
        const targetAngle = targetIndex * sectorAngle + (sectorAngle / 2); // Center of sector

        // Add extra spins for excitement (5-8 full rotations)
        const extraSpins = 5 + Math.random() * 3;
        const extraDegrees = extraSpins * 360;

        // Calculate final rotation to land on target (we rotate wheel, so we need to invert)
        const finalRotation = this.rotation + extraDegrees + (360 - targetAngle);

        const wheelElement = document.querySelector('.wheel-svg') as HTMLElement;
        if (wheelElement) {
            wheelElement.style.transition = 'transform 4s cubic-bezier(0.12, 0, 0.39, 0)';
            wheelElement.style.transform = `rotate(${finalRotation}deg)`;

            setTimeout(() => {
                this.rotation = finalRotation;
                this.isSpinning = false;
                this.spinComplete.emit(targetIndex);
            }, 4000);
        }
    }
}
