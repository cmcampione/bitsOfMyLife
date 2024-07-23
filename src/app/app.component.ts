import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxTimelineModule, NgxTimelineEvent } from '@frxjs/ngx-timeline';
import { Store } from '@ngrx/store';
import { selectBitsOfMyLife } from './app.selectors';
import { AppState } from './app.state';
import { Observable } from 'rxjs';
import { BitsOfMyLife } from './app.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxTimelineModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'bitsOfMyLife';
  
  bitsOfMyLife$: Observable<BitsOfMyLife> = this.store.select(selectBitsOfMyLife);
  
  events: NgxTimelineEvent[];

  constructor(private store: Store<AppState>) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowPlusOneHour = new Date();
    tomorrowPlusOneHour.setDate(today.getDate() + 1);
    tomorrowPlusOneHour.setHours(today.getHours() + 1);
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    this.events = [
      { id: 5, description: 'This is the description of the event 5', timestamp: today, title: 'title 5' },
      { id: 0, description: 'This is the description of the event 0', timestamp: today, title: 'title 0' },
      { id: 1, description: 'This is the description of the event 1', timestamp: tomorrow, title: 'title 1' },
      { id: 2, description: 'This is the description of the event 2', timestamp: today, title: 'title 2' },
      { id: 3, description: 'This is the description of the event 3', timestamp: tomorrow, title: 'title 3' },
      { id: 4, description: 'This is the description of the event 4', timestamp: nextMonth, title: 'title 4', /*itemPosition: NgxTimelineItemPosition.ON_RIGHT */},
    ];
  }
}


