import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe, NgFor, NgIf} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxTimelineModule, NgxTimelineEvent } from '@frxjs/ngx-timeline';
import { Store } from '@ngrx/store';
import { selectBitsOfMyLife } from './bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.state';
import { Observable } from 'rxjs';
import { BitOfMyLifeToAdd, BitOfMyLifeToEdit, BitsOfMyLife } from './bits-of-my-life/bits-of-my-life.models';
import * as BitsOfMyLifeActions from './bits-of-my-life/bits-of-my-life.actions';
import { FormsModule } from '@angular/forms';
import { AppState, selectAppState } from './global/globalMng';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxTimelineModule, AsyncPipe, NgFor, NgIf, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'bitsOfMyLife';
  
  appState$: Observable<AppState> = this.appStateStore.select(selectAppState);
  bitsOfMyLife$: Observable<BitsOfMyLife> = this.bitsOfMyLifeStore.select(selectBitsOfMyLife);

  newBit: BitOfMyLifeToAdd = { date: new Date(), note: '' };
  editingBit: BitOfMyLifeToEdit = { id: 0, date: new Date(), note: '' };
  
  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>,
    private appStateStore: Store<AppState>) {
  }

  ngOnInit() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.loadState());
  }

  addBitOfMyLife(): void {
    this.newBit.date = new Date(this.newBit.date);
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.addBitOfMyLife({ bitOfMyLifeToAdd: this.newBit }));
    this.newBit = { date: new Date(), note: '' };
  }

  editBitOfMyLife(bitOfMyLife: any): void {
    this.editingBit = { ...bitOfMyLife.milestone, date: new Date(bitOfMyLife.milestone.date) };
  }

  updateBitOfMyLife(bitOfMyLife: BitOfMyLifeToEdit): void {
    if (bitOfMyLife.id > 0) {
      this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.editBitOfMyLife({ bitOfMyLifeToEdit: bitOfMyLife }));
      this.editingBit = { id: 0, date: new Date(), note: '' };  // Reset after update
    } else {
      console.error('Invalid ID for updating BitOfMyLife');
    }
  }

  deleteBitMyLife(id: number) {
    const userConfirmed = confirm('Sei sicuro di voler cancellare questo elemento?');
    if (userConfirmed) {
      this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.deleteBitOfMyLife({ id }));
    }
  }
}

