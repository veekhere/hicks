import { Component } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

type ButtonDescriptor = {
  id: number;
  visibleInMode: GameMode[];
};

enum GameState {
  IN_PROCESS,
  OFFLINE
}

enum GameMode {
  MODE_2x2 = '2x2',
  MODE_3x3 = '3x3',
  MODE_4x4 = '4x4',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private readonly a = 395;
  private readonly b = 395;

  private readonly destroySubject = new Subject();
  readonly gameState = GameState;
  readonly gameMode = GameMode;

  private readonly allButtons: ButtonDescriptor[] = [
    { id: 1, visibleInMode: [GameMode.MODE_2x2, GameMode.MODE_3x3, GameMode.MODE_4x4] },
    { id: 2, visibleInMode: [GameMode.MODE_2x2, GameMode.MODE_3x3, GameMode.MODE_4x4] },
    { id: 3, visibleInMode: [GameMode.MODE_2x2, GameMode.MODE_3x3, GameMode.MODE_4x4] },
    { id: 4, visibleInMode: [GameMode.MODE_2x2, GameMode.MODE_3x3, GameMode.MODE_4x4] },
    { id: 5, visibleInMode: [GameMode.MODE_3x3, GameMode.MODE_4x4] },
    { id: 6, visibleInMode: [GameMode.MODE_3x3, GameMode.MODE_4x4] },
    { id: 7, visibleInMode: [GameMode.MODE_3x3, GameMode.MODE_4x4] },
    { id: 8, visibleInMode: [GameMode.MODE_3x3, GameMode.MODE_4x4] },
    { id: 9, visibleInMode: [GameMode.MODE_3x3, GameMode.MODE_4x4] },
    { id: 10, visibleInMode: [GameMode.MODE_4x4] },
    { id: 11, visibleInMode: [GameMode.MODE_4x4] },
    { id: 12, visibleInMode: [GameMode.MODE_4x4] },
    { id: 13, visibleInMode: [GameMode.MODE_4x4] },
    { id: 14, visibleInMode: [GameMode.MODE_4x4] },
    { id: 15, visibleInMode: [GameMode.MODE_4x4] },
    { id: 16, visibleInMode: [GameMode.MODE_4x4] },
  ];

  readonly state$ = new BehaviorSubject<GameState>(GameState.OFFLINE);
  readonly mode$ = new BehaviorSubject<GameMode>(null);
  readonly startDate$ = new BehaviorSubject<Date>(null);

  readonly visibleButtons$ = new BehaviorSubject<ButtonDescriptor[]>([]);

  readonly target$ = new BehaviorSubject<string>(null);

  click(id: number): void {
    if (id?.toString() !== this.target$.value) {
      alert('Wrong answer');
      return;
    }
    const date = new Date();
    const realTime = (date.getTime() - this.startDate$.value?.getTime()) / 1000;
    const approximateTime = (this.a + this.b * Math.log2(this.visibleButtons$.value?.length + 1)) / 1000;
    alert(`We calculated: ${approximateTime}\nYou got: ${realTime}`);
    this.startGame();
  }

  changeState(): void {
    this.state$.next(this.state$.value === GameState.IN_PROCESS ? GameState.OFFLINE : GameState.IN_PROCESS);
    if (this.state$.value === GameState.IN_PROCESS) {
      this.startGame();
    } else {
      this.target$.next(null);
    }
  }

  private startGame(): void {
    this.setMode();
    this.setButtons();
    this.setTarget();
    this.startDate$.next(new Date());
  }

  private setMode(): void {
    const modes = [GameMode.MODE_2x2, GameMode.MODE_3x3, GameMode.MODE_4x4];
    const pick = Math.floor(Math.random() * (modes.length - 1 + 1) + 0);
    this.mode$.next(modes[pick]);
  }

  private setButtons(): void {
    const visibleButtons = this.allButtons.filter((b) => b?.visibleInMode?.includes(this.mode$.value));
    this.visibleButtons$.next(this.shuffle(visibleButtons));
  }

  private shuffle(array: ButtonDescriptor[]): ButtonDescriptor[] {
    return array.sort(() => Math.random() - 0.5);
  }

  private setTarget(): void {
    this.target$.next(Math.floor(Math.random() * (this.visibleButtons$.value?.length - 1 + 1) + 1).toString());
  }
}
