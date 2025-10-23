import { Component, isDevMode, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IonApp } from '@ionic/angular/standalone';
import { IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, create, pencil, add } from 'ionicons/icons';

import { AppState, selectAppState } from './global/globalMng';

import { BitOfMyLife, MilestoneToAdd, MilestoneToEdit } from './bits-of-my-life/bits-of-my-life.models';
import * as BitsOfMyLifeActions from './bits-of-my-life/bits-of-my-life.actions';
import { todayMilestoneId, selectBitsOfMyLifeMngr, selectTimelinesMngr } from './bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState, SelectedBitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.state';

import { PageTransitionComponent } from './components/slide.component'
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
  selectedBitsOfMyLifeState$: Observable<SelectedBitsOfMyLifeState> = this.bitsOfMyLifeStore.select(selectBitsOfMyLifeMngr);

  todayMilestoneId = todayMilestoneId;

  formatedDate: string = '';

  newMilestone: MilestoneToAdd = { date: new Date(), note: '' };
  isAddBitOfMyLifeModalOpen = false;

  editingMilestone: MilestoneToEdit = { id: "", date: new Date(), note: '' };
  isEditBitOfMyLifeModalOpen = false;

  @ViewChild('pageTransition') pageTransition!: PageTransitionComponent;
  
  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>,
    private appStateStore: Store<AppState>) {
      addIcons({ trash, create, pencil, add });
  }

  ngOnInit() {

    this.selectedBitsOfMyLifeState$.subscribe(state => {
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

  prevTimeline() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.selectOrAddPrevTimeline());
  }

  nextTimeline() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.selectOrAddNextTimeline());
  }
}
