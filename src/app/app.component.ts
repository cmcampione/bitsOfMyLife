import { Component } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxTimelineModule, NgxTimelineEvent } from '@frxjs/ngx-timeline';
import { Store } from '@ngrx/store';
import { selectBitsOfMyLife } from './bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.state';
import { Observable } from 'rxjs';
import { BitOfMyLifeToAdd, BitsOfMyLife } from './bits-of-my-life/bits-of-my-life.models';
import * as BitsOfMyLifeActions from './bits-of-my-life/bits-of-my-life.actions';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxTimelineModule, AsyncPipe, NgFor, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'bitsOfMyLife';
  
  bitsOfMyLife$: Observable<BitsOfMyLife> = this.store.select(selectBitsOfMyLife);

  newBit: BitOfMyLifeToAdd = { date: new Date(), note: '' };
  
  constructor(private store: Store<BitsOfMyLifeState>) {
  }

  addBitOfMyLife(bitOfMyLife: BitOfMyLifeToAdd): void {
    this.store.dispatch(BitsOfMyLifeActions.addBitOfMyLife({ bitOfMyLife }));
    this.newBit = { date: new Date(), note: '' };
  }
}

