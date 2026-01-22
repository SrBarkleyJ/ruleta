import { Component } from '@angular/core';
import { GameScreenComponent } from './components/game-screen/game-screen.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [GameScreenComponent],
    template: '<app-game-screen></app-game-screen>',
    styles: []
})
export class AppComponent {
    title = 'neon-roulette';
}
