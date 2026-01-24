import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sector, WheelSkin } from '../../models/game.model';

@Component({
    selector: 'app-roulette-wheel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './roulette-wheel.component.html',
    styleUrls: ['./roulette-wheel.component.css']
})
export class RouletteWheelComponent {
    @Input() sectors: Sector[] = [];
    @Input() skin?: WheelSkin;
    @Output() spinComplete = new EventEmitter<number>();

    wheelSize = 300;
    radius = 150;
    rotation = 0;
    isSpinning = false;
    showResultOverlay = false;
    winningSector: Sector | null = null;

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

    spinToSector(targetIndex: number): void {
        if (this.isSpinning) return;

        this.isSpinning = true;

        // Calculate the angle for the target sector center
        const angles = this.getSectorAnglesList()[targetIndex];
        const targetAngle = angles.center;

        // Add extra spins for excitement (5-8 full rotations)
        const extraSpins = 5 + Math.random() * 3;
        const extraDegrees = extraSpins * 360;

        // Calculate final rotation to land on target (we rotate wheel, so we need to invert)
        // 360 - targetAngle because CSS rotation is clockwise but wheel landing logic 
        // usually thinks about the pointer at the top (0 deg)
        const targetOffset = (360 - (targetAngle % 360)) % 360;
        const currentMod = this.rotation % 360;

        // Calculate how much we need to add to reach targetOffset from currentMod
        let rotationToAdd = targetOffset - currentMod;
        if (rotationToAdd <= 0) rotationToAdd += 360; // Ensure clockwise spin

        const finalRotation = this.rotation + extraDegrees + rotationToAdd;

        const wheelElement = document.querySelector('.wheel-svg') as HTMLElement;
        if (wheelElement) {
            wheelElement.style.transition = 'transform 4s cubic-bezier(0.12, 0, 0.39, 0)';
            wheelElement.style.transform = `rotate(${finalRotation}deg)`;

            setTimeout(() => {
                this.rotation = finalRotation;
                this.isSpinning = false;
                this.winningSector = this.sectors[targetIndex];
                this.showResultOverlay = true;

                setTimeout(() => {
                    this.showResultOverlay = false;
                    this.spinComplete.emit(targetIndex);
                }, 2000); // Overlay duration
            }, 4000);
        }
    }
}
