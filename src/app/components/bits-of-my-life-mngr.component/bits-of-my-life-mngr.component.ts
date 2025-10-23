import { Component, isDevMode, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf} from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { addIcons } from 'ionicons';
import { trash, create, pencil, add, chevronBackOutline, chevronForwardOutline  } from 'ionicons/icons';

import { BitOfMyLife, MilestoneToAdd, MilestoneToEdit} from '../../bits-of-my-life/bits-of-my-life.models';
import * as BitsOfMyLifeActions from '../../bits-of-my-life/bits-of-my-life.actions';
import { todayMilestoneId, selectSelectedBitsOfMyLife } from '../../bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState, SelectedBitsOfMyLifeState } from '../../bits-of-my-life/bits-of-my-life.state';
import { IonList, IonCardContent, IonNote, IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-bits-of-my-live-mngr',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, CommonModule, FormsModule, IonList, IonCardContent, IonNote, IonButton, IonIcon],
  templateUrl: './bits-of-my-life-mngr.component.html',
  styleUrls: ['./bits-of-my-life-mngr.component.scss']
})
export class BitsOfMyLifeMngrComponent {

  backIcon = chevronBackOutline;
  forwardIcon = chevronForwardOutline;

  isDev = signal(isDevMode());
  //isDev = signal(false);

  selectedBitsOfMyLifeState$: Observable<SelectedBitsOfMyLifeState> = this.bitsOfMyLifeStore.select(selectSelectedBitsOfMyLife);
  
  todayMilestoneId = todayMilestoneId;
  
  formatedDate: string = '';

  newMilestone: MilestoneToAdd = { date: new Date(), note: '' };
  isAddBitOfMyLifeModalOpen = false;

  editingMilestone: MilestoneToEdit = { id: "", date: new Date(), note: '' };
  isEditBitOfMyLifeModalOpen = false;

  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>) {
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
}

