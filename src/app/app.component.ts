import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf} from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { PageTransitionComponent } from './hs.component'

import { IonHeader, IonInput, IonItemSliding } from '@ionic/angular/standalone';
import { IonIcon, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonText, IonCardHeader, IonNote, 
  IonCardTitle, IonButton, IonItem, IonItemOption, IonItemOptions, IonList, IonLabel, IonModal, IonButtons, IonInfiniteScroll,
  IonInfiniteScrollContent, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, create, pencil, add } from 'ionicons/icons';

import { AppState, selectAppState } from './global/globalMng';

import { BitOfMyLife, MilestoneToAdd, MilestoneToEdit } from './bits-of-my-life/bits-of-my-life.models';
import * as BitsOfMyLifeActions from './bits-of-my-life/bits-of-my-life.actions';
import { todayMilestoneId, selectSelectedBitsOfMyLife } from './bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState, SelectedBitsOfMyLifeState } from './bits-of-my-life/bits-of-my-life.state';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonText, IonButtons, IonNote, IonFab, IonFabButton,
    IonCardHeader, IonCardTitle, IonButton, IonList, IonItem, IonItemOptions, IonItemOption, IonItemSliding, IonLabel, IonInput, IonIcon, IonModal, 
    IonInfiniteScroll, IonInfiniteScrollContent, PageTransitionComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'bitsOfMyLife';
  
  appState$: Observable<AppState> = this.appStateStore.select(selectAppState);
  selectedBitsOfMyLifeState$: Observable<SelectedBitsOfMyLifeState> = this.bitsOfMyLifeStore.select(selectSelectedBitsOfMyLife);

  todayMilestoneId = todayMilestoneId;

  formatedDate: string = '';

  newMilestone: MilestoneToAdd = { date: new Date(), note: '' };
  isAddModalOpen = false;

  editingMilestone: MilestoneToEdit = { id: "", date: new Date(), note: '' };
  isEditModalOpen = false;
  
  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>,
    private appStateStore: Store<AppState>) {
      addIcons({ trash, create, pencil, add });
  }

  @ViewChild('pageTransition') pageTransition!: PageTransitionComponent;


  ngOnInit() {
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.loadState());
  }

  addBitOfMyLife(): void {
    this.newMilestone.date = new Date();
    this.formatedDate = this.newMilestone.date.toISOString().split('T')[0];
    this.isAddModalOpen = true;
  }

  addedBitOfMyLife(): void {
    this.newMilestone.date = new Date(this.formatedDate);
    this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.addMilestone({ milestoneToAdd: this.newMilestone }));
    this.newMilestone = { date: new Date(), note: '' };
    this.isAddModalOpen = false;
  }

  closeAddDialog() {
    this.isAddModalOpen = false;
  }
  
  editBitOfMyLife(bitOfMyLife: BitOfMyLife): void {
    this.formatedDate = bitOfMyLife.milestone.date.toISOString().split('T')[0];
    this.editingMilestone = { ...bitOfMyLife.milestone, date: bitOfMyLife.milestone.date };
    this.isEditModalOpen = true;
  }

  updateBitOfMyLife(): void {
    if (this.editingMilestone.id != "") {
      this.editingMilestone.date = new Date(this.formatedDate);
      this.bitsOfMyLifeStore.dispatch(BitsOfMyLifeActions.editMilestone({ milestoneToEdit: this.editingMilestone }));
      this.editingMilestone = { id: "", date: new Date(), note: '' };  // Reset after update
    } else {
      console.error('Invalid ID for updating BitOfMyLife');
    }
    this.isEditModalOpen = false;
  }

  closeEditDialog() {
    this.isEditModalOpen = false;
  }

  deleteBitMyLife(id: string) {
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
