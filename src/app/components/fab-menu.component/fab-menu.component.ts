import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonLabel, IonInput, IonItem } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close, giftOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { Timeline } from '../../bits-of-my-life/bits-of-my-life.models';
import { BitsOfMyLifeState } from '../../bits-of-my-life/bits-of-my-life.state';
import { Store } from '@ngrx/store';
import { addTimeline } from '../../bits-of-my-life/bits-of-my-life.actions';

@Component({
  selector: 'app-fab-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, 
    IonFab, IonFabButton, IonFabList, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonLabel, IonInput, IonItem],
  templateUrl: './fab-menu.component.html',
  styleUrls: ['./fab-menu.component.scss']
})
export class FabMenuComponent {

  formatedDate: string = '';
  isOpen = false;
  isAddTimelineModalOpen: boolean = false;
  newTimeline: Timeline = { id: '', name: '', mainDate: new Date()};
  
  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>) {
    addIcons({ add, close, giftOutline, checkmarkCircleOutline });
  }

  toggleFab() {
    this.isOpen = !this.isOpen; // solo per label esterne
  }

  closeAddTimelineDialog() {
    this.isAddTimelineModalOpen = false;
  }

  addedTimeline(): void {
      this.newTimeline.mainDate = new Date(this.formatedDate);
      this.bitsOfMyLifeStore.dispatch(addTimeline({ timelineToAdd: this.newTimeline }));
      this.newTimeline = { id: '', mainDate: new Date(), name: '' };
      this.isAddTimelineModalOpen = false;
  }

  onNewTimeline() {
    this.newTimeline.mainDate = new Date();
    this.formatedDate = this.newTimeline.mainDate.toISOString().split('T')[0];
    this.isAddTimelineModalOpen = true;
    this.isOpen = false; // chiude le label
  }

  onNewBitOfMyLife() {
    console.log('Data importante');
    this.isOpen = false; // chiude le label
  }
}
