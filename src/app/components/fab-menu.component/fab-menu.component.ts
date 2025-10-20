import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fab-menu',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './fab-menu.component.html',
  styleUrls: ['./fab-menu.component.scss'],
})
export class FabMenuComponent {

  isOpen = false;

  toggleFab() {
    this.isOpen = !this.isOpen;
  }

  onNewTimeline() {
    console.log('Azione Compleanno');
  }

  onNewBitOfMyLife() {
    console.log('Azione Attività');
  }
}
