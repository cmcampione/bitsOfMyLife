import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxTimelineModule, NgxTimelineEvent } from '@frxjs/ngx-timeline';
import { Store } from '@ngrx/store';
import { selectBitsOfMyLife } from './bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.state';
import { Observable } from 'rxjs';
import { BitOfMyLifeToAdd, BitsOfMyLife } from './bits-of-my-life/bits-of-my-life.models';
import * as BitsOfMyLifeActions from './bits-of-my-life/bits-of-my-life.actions';
import { FormsModule } from '@angular/forms';
import { AppState, selectAppState } from './global/globalMng';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxTimelineModule, AsyncPipe, NgFor, NgIf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'bitsOfMyLife';
  
  appState$: Observable<AppState> = this.appStateStore.select(selectAppState);
  bitsOfMyLife$: Observable<BitsOfMyLife> = this.bitsOfMyLifeStore.select(selectBitsOfMyLife);

  newBit: BitOfMyLifeToAdd = { date: new Date(), note: '' };
  
  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>,
    private appStateStore: Store<AppState>) {
  }

  ngOnInit() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.loadState());
  }

  addBitOfMyLife(bitOfMyLife: BitOfMyLifeToAdd): void {
    bitOfMyLife.date = new Date(bitOfMyLife.date);
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.addBitOfMyLife({ bitOfMyLife }));
    this.newBit = { date: new Date(), note: '' };
  }

  deleteBitMyLife(id: number) {
    const userConfirmed = confirm('Sei sicuro di voler cancellare questo elemento?');
    if (userConfirmed) {
      this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.deleteBitOfMyLife({ id }));
    }
  }
}

