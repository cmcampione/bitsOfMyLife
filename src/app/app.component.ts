import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe, NgFor, NgIf} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxTimelineModule, NgxTimelineEvent } from '@frxjs/ngx-timeline';
import { Store } from '@ngrx/store';
import { todayMilestoneId, selectSelectedBitsOfMyLife } from './bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState, SelectedBitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.state';
import { Observable } from 'rxjs';
import { BitOfMyLife, MilestoneToAdd, MilestoneToEdit } from './bits-of-my-life/bits-of-my-life.models';
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
  selectedBitsOfMyLifeState$: Observable<SelectedBitsOfMyLifeState> = this.bitsOfMyLifeStore.select(selectSelectedBitsOfMyLife);

  todayMilestoneId = todayMilestoneId;

  newMilestone: MilestoneToAdd = { date: new Date(), note: '' };
  editingMilestone: MilestoneToEdit = { id: "", date: new Date(), note: '' };
  
  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>,
    private appStateStore: Store<AppState>) {
  }

  ngOnInit() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.loadState());
  }

  addBitOfMyLife(): void {
    this.newMilestone.date = new Date(this.newMilestone.date);
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.addMilestone({ milestoneToAdd: this.newMilestone }));
    this.newMilestone = { date: new Date(), note: '' };
  }

  editBitOfMyLife(bitOfMyLife: BitOfMyLife): void {
    this.editingMilestone = { ...bitOfMyLife.milestone, date: new Date(bitOfMyLife.milestone.date) };
  }

  updateBitOfMyLife(bitOfMyLife: MilestoneToEdit): void {
    if (bitOfMyLife.id != "") {
      this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.editMilestone({ milestoneToEdit: bitOfMyLife }));
      this.editingMilestone = { id: "", date: new Date(), note: '' };  // Reset after update
    } else {
      console.error('Invalid ID for updating BitOfMyLife');
    }
  }

  deleteBitMyLife(id: string) {
    const userConfirmed = confirm('Sei sicuro di voler cancellare questo elemento?');// ToDo: To localize
    if (userConfirmed) {
      this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.deleteMilestone({ id }));
    }
  }
}

