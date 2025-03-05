import { Component, isDevMode, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf} from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IonHeader, IonInput } from '@ionic/angular/standalone';
import { IonIcon, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonText, IonCardHeader, 
  IonCardTitle, IonButton, IonItem, IonNote, IonList, IonLabel, IonModal, IonFab, IonFabButton, IonButtons, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, create, pencil, add } from 'ionicons/icons';

import { AppState, selectAppState } from './global/globalMng';

import { BitOfMyLife, MilestoneToAdd, MilestoneToEdit, Timeline } from './bits-of-my-life/bits-of-my-life.models';
import * as BitsOfMyLifeActions from './bits-of-my-life/bits-of-my-life.actions';
import { todayMilestoneId, selectSelectedBitsOfMyLife } from './bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState, SelectedBitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.state';
import { defaultTimelineId, defaultTimelineIndex } from './bits-of-my-life/bits-of-my-life.reducer';

import { PageTransitionComponent } from './slide.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonText, IonButtons,
    IonCardHeader, IonCardTitle, IonButton, IonItem, IonNote, IonInfiniteScroll, IonInfiniteScrollContent,
    IonList, IonLabel, IonInput, IonIcon, IonModal, IonFab, IonFabButton,
    PageTransitionComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isDev = signal(isDevMode());

  title = 'bitsOfMyLife';
  
  appState$: Observable<AppState> = this.appStateStore.select(selectAppState);
  selectedBitsOfMyLifeState$: Observable<SelectedBitsOfMyLifeState> = this.bitsOfMyLifeStore.select(selectSelectedBitsOfMyLife);

  todayMilestoneId = todayMilestoneId;

  defaultTimelineIndex = defaultTimelineIndex;
  defaultTimelineId = defaultTimelineId;

  formatedDate: string = '';

  newMilestone: MilestoneToAdd = { date: new Date(), note: '' };
  isAddBitOfMyLifeModalOpen = false;

  editingMilestone: MilestoneToEdit = { id: "", date: new Date(), note: '' };
  isEditBitOfMyLifeModalOpen = false;

  selectedTimelineIndex = defaultTimelineIndex;
  selectedTimelineId = defaultTimelineId;

  editingTimeline: Timeline = {id: '', name: '', mainDate: new Date() };
  isEditTimelineModalOpen = false;
  
  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>,
    private appStateStore: Store<AppState>) {
      addIcons({ trash, create, pencil, add });
  }

  @ViewChild('pageTransition') pageTransition!: PageTransitionComponent;

  ngOnInit() {

    this.selectedBitsOfMyLifeState$.subscribe(state => {
      this.selectedTimelineIndex = state.timelineIndex;
      this.selectedTimelineId = state.timelineId;
      this.editingTimeline = {id: state.timelineId, mainDate: state.timelineMainDate, name: state.timelineName};
    });

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

  closeAddBitOfMyLifeDialog() {
    this.isAddBitOfMyLifeModalOpen = false;
  }
  
  editBitOfMyLife(bitOfMyLife: BitOfMyLife): void {
    if (bitOfMyLife.milestone.id === todayMilestoneId) {
      // Not necessary to raise an error, but just to report in console
      // UI should not allow to edit today milestone
      console.error('Invalid ID for updating BitOfMyLife');
      return
    }
    this.formatedDate = bitOfMyLife.milestone.date.toISOString().split('T')[0];
    this.editingMilestone = { ...bitOfMyLife.milestone, date: bitOfMyLife.milestone.date };
    this.isEditBitOfMyLifeModalOpen = true;
  }

  updateBitOfMyLife(): void {
    if (this.editingMilestone.id === todayMilestoneId) {
       // Not necessary to raise an error, but just to report in console
       // UI should not allow to edit today milestone
      console.error('Invalid ID for updating BitOfMyLife');
      return
    }
    this.editingMilestone.date = new Date(this.formatedDate);
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.editMilestone({ milestoneToEdit: this.editingMilestone }));
    this.editingMilestone = { id: "", date: new Date(), note: '' };  // Reset after update
    this.isEditBitOfMyLifeModalOpen = false;
  }

  closeEditBitOfMyLifeDialog() {
    this.isEditBitOfMyLifeModalOpen = false;
  }

  deleteBitOfMyLife(id: string) {
    // Not necessary to raise an error, but just to report in console
    // UI should not allow to delete today milestone
    if (id === todayMilestoneId) {
      console.error('Invalid ID for delete BitOfMyLife');
      return
    }
    const userConfirmed = confirm('Sei sicuro di voler cancellare questo elemento?');// ToDo: To localize
    if (userConfirmed) {
      this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.deleteMilestone({ milestoneIdToRemove: id }));
    }
  }

  editSelectedTimeline(): void {
    this.formatedDate = this.editingTimeline.mainDate.toISOString().split('T')[0];
    this.isEditTimelineModalOpen = true;
  }

  updateSelectedTimeline(): void {
    this.editingTimeline.mainDate = new Date(this.formatedDate);
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.editSelectedTimeline({ timelineToEdit: this.editingTimeline }));
    this.editingTimeline = {id: '', mainDate: new Date(), name: '' };  // Reset after update
    this.isEditTimelineModalOpen = false;
  }

  closeEditSelectedTimelineDialog() {
    this.isEditTimelineModalOpen = false;
  }

  deleteSelectedTimeline() {
    // Not necessary to raise an error, but just to report in console
    // UI should not allow to delete default timeline
    if (this.selectedTimelineId === defaultTimelineId) {
      console.error('Invalid ID for delete Timeline');
      return
    }
    const userConfirmed = confirm('Sei sicuro di voler cancellare questa Timeline?');// ToDo: To localize
    if (userConfirmed) {
      this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.deleteSelectedTimeline());
    }
  }

  prevTimeline() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.selectOrAddPrevTimeline());
  }

  nextTimeline() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.selectOrAddNextTimeline());
  }
}

