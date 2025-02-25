import { Component } from '@angular/core';
import { CommonModule, Time } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf} from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IonHeader, IonInput } from '@ionic/angular/standalone';
import { IonIcon, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonText, IonCardHeader, 
  IonCardTitle, IonButton, IonItem, IonLabel, IonModal, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, create } from 'ionicons/icons';

import { AppState, selectAppState } from './global/globalMng';

import { BitOfMyLife, MilestoneToAdd, MilestoneToEdit, Timeline } from './bits-of-my-life/bits-of-my-life.models';
import * as BitsOfMyLifeActions from './bits-of-my-life/bits-of-my-life.actions';
import { todayMilestoneId, selectSelectedBitsOfMyLife } from './bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState, SelectedBitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonText, IonButtons,
    IonCardHeader, IonCardTitle, IonButton, IonItem, IonLabel, IonInput, IonIcon, IonModal],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'bitsOfMyLife';
  
  appState$: Observable<AppState> = this.appStateStore.select(selectAppState);
  selectedBitsOfMyLifeState$: Observable<SelectedBitsOfMyLifeState> = this.bitsOfMyLifeStore.select(selectSelectedBitsOfMyLife);

  todayMilestoneId = todayMilestoneId;

  formatedDate: string = '';

  editingTimeline: Timeline = { name: '', mainDate: new Date() };
  isEditTimelineModalOpen = false;

  newMilestone: MilestoneToAdd = { date: new Date(), note: '' };
  isAddBitOfMyLifeModalOpen = false;

  editingMilestone: MilestoneToEdit = { id: "", date: new Date(), note: '' };
  isEditBitOfMyLifeModalOpen = false;
  
  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>,
    private appStateStore: Store<AppState>) {
      addIcons({ trash, create });
  }

  ngOnInit() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.loadState());
  }

  addBitOfMyLife(): void {
    this.newMilestone.date = new Date();
    this.formatedDate = this.newMilestone.date.toISOString().split('T')[0];
    this.isAddBitOfMyLifeModalOpen = true;
  }

  addedBitOfMyLife(): void {
    this.newMilestone.date = new Date(this.formatedDate);
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.addMilestone({ milestoneToAdd: this.newMilestone }));
    this.newMilestone = { date: new Date(), note: '' };
    this.isAddBitOfMyLifeModalOpen = false;
  }

  closeAddBitOfMyLigeDialog() {
    this.isAddBitOfMyLifeModalOpen = false;
  }
  
  editBitOfMyLife(bitOfMyLife: BitOfMyLife): void {
    this.formatedDate = bitOfMyLife.milestone.date.toISOString().split('T')[0];
    this.editingMilestone = { ...bitOfMyLife.milestone, date: bitOfMyLife.milestone.date };
    this.isEditBitOfMyLifeModalOpen = true;
  }

  updateBitOfMyLife(): void {
    if (this.editingMilestone.id != "") {
      this.editingMilestone.date = new Date(this.formatedDate);
      this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.editMilestone({ milestoneToEdit: this.editingMilestone }));
      this.editingMilestone = { id: "", date: new Date(), note: '' };  // Reset after update
    } else {
      console.error('Invalid ID for updating BitOfMyLife');
    }
    this.isEditBitOfMyLifeModalOpen = false;
  }

  closeEditBitOfMyLifeDialog() {
    this.isEditBitOfMyLifeModalOpen = false;
  }

  deleteBitOfMyLife(id: string) {
    const userConfirmed = confirm('Sei sicuro di voler cancellare questo elemento?');// ToDo: To localize
    if (userConfirmed) {
      this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.deleteMilestone({ milestoneIdToRemove: id }));
    }
  }

  editTimeline(): void {
    this.selectedBitsOfMyLifeState$.subscribe(state => {
      this.editingTimeline = {mainDate: state.timelineMainDate, name: state.timelineName};
      this.formatedDate = this.editingTimeline.mainDate.toISOString().split('T')[0];
    });
    this.isEditTimelineModalOpen = true;
  }

  updateTimeline(): void {
      this.editingTimeline.mainDate = new Date(this.formatedDate);
      this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.editSelectedTimeline({ timelineToEdit: this.editingTimeline }));
      this.editingTimeline = { mainDate: new Date(), name: '' };  // Reset after update
      this.isEditTimelineModalOpen = false;
  }

  closeEditTimelineDialog() {
    this.isEditTimelineModalOpen = false;
  }

  prevTimeline() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.selectOrAddPrevTimeline());
  }

  nextTimeline() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.selectOrAddNextTimeline());
  }
}

