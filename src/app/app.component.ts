import { Component, isDevMode, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IonApp } from '@ionic/angular/standalone';
import { IonContent } from '@ionic/angular/standalone';

import { AppState, selectAppState } from './global/globalMng';
import * as BitsOfMyLifeActions from './bits-of-my-life/bits-of-my-life.actions';
import { selectBitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.state';

import { TimelinesMngrComponent } from './components/timeline-mngr.component/timeline-mngr.component';
import { BitsOfMyLifeMngrComponent } from "./components/bits-of-my-life-mngr.component/bits-of-my-life-mngr.component";
import { FabMenuComponent } from "./components/fab-menu.component/fab-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent,
    TimelinesMngrComponent, IonApp, FabMenuComponent, BitsOfMyLifeMngrComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isDev = signal(isDevMode());
  //isDev = signal(false);

  title = 'bitsOfMyLife';
  
  appState$: Observable<AppState> = this.appStateStore.select(selectAppState);
  selectedBitsOfMyLifeState$: Observable<BitsOfMyLifeState> = this.bitsOfMyLifeStore.select(selectBitsOfMyLifeState);

  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>,
    private appStateStore: Store<AppState>) {
  }

  ngOnInit() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.loadState());
  }
}
