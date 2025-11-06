import { Component, ViewChild, isDevMode, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IonApp, IonMenu, IonButtons, IonMenuButton, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, MenuController } from '@ionic/angular/standalone';
import { IonContent } from '@ionic/angular/standalone';
import { IonHeader } from '@ionic/angular/standalone';
import { IonToolbar } from '@ionic/angular/standalone';
import { IonTitle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import { AppState, selectAppState } from './global/globalMng';
import * as BitsOfMyLifeActions from './bits-of-my-life/bits-of-my-life.actions';
import { selectBitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.state';

import { TimelinesMngrComponent } from './components/timeline-mngr.component/timeline-mngr.component';
import { BitsOfMyLifeMngrComponent } from "./components/bits-of-my-life-mngr.component/bits-of-my-life-mngr.component";
import { FabMenuComponent } from "./components/fab-menu.component/fab-menu.component";
import { homeOutline, informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonTitle,
    IonHeader, IonToolbar,
    TimelinesMngrComponent, IonApp, FabMenuComponent, BitsOfMyLifeMngrComponent, IonMenu, IonButtons, IonMenuButton, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel],
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
    private appStateStore: Store<AppState>,
    private menuCtrl: MenuController) {
      addIcons({ homeOutline, informationCircleOutline });
  }

  ngOnInit() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.loadState());
  }

  async ngAfterViewInit() {
    // Disabilita swipe all’avvio → non si può aprire con swipe
    await this.menuCtrl.swipeGesture(false, 'mainMenu');

    const menu = await this.menuCtrl.get('mainMenu');
    if (!menu) return;

    // ✅ Usa addEventListener invece di .ionDidOpen / .ionDidClose
    menu.addEventListener('ionDidOpen', async () => {
      await this.menuCtrl.swipeGesture(true, 'mainMenu'); // resta disabilitato per apertura
    });

    menu.addEventListener('ionDidClose', async () => {
      await this.menuCtrl.swipeGesture(false, 'mainMenu'); // abilita swipe per chiusura
    });
  }
}
