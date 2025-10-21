import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close, giftOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-fab-menu',
  standalone: true,
  imports: [CommonModule, IonFab, IonFabButton, IonFabList, IonIcon, IonLabel],
  templateUrl: './fab-menu.component.html',
  styleUrls: ['./fab-menu.component.scss']
})
export class FabMenuComponent {
  isOpen = false;

  constructor() {
    addIcons({ add, close, giftOutline, checkmarkCircleOutline });
  }

  toggleFab() {
    this.isOpen = !this.isOpen; // solo per label esterne
  }

  onNewTimeline() {
    console.log('Grande evento');
    this.isOpen = false; // chiude le label
  }

  onNewBitOfMyLife() {
    console.log('Data importante');
    this.isOpen = false; // chiude le label
  }
}
