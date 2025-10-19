import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgFor, NgIf, DatePipe} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IonInput, IonButton, IonButtons, IonIcon, IonCard, IonCardSubtitle, IonCardContent, IonCardHeader, IonCardTitle, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, create, pencil } from 'ionicons/icons';
import { Timeline, TimelinesMngr } from '../../bits-of-my-life/bits-of-my-life.models';
import { defaultTimelineId } from '../../bits-of-my-life/bits-of-my-life.reducer';
import { selectSelectedTimelineId, selectTimelinesMngr } from '../../bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState } from '../../bits-of-my-life/bits-of-my-life.state';
import { Store } from '@ngrx/store';
import { deleteTimelineById, updateTimeline, selectTimelineById,  addTimeline } from '../../bits-of-my-life/bits-of-my-life.actions';

@Component({
    selector: 'app-timeline-manager',
    templateUrl: './timeline-mngr.component.html',
    styleUrls: ['./timeline-mngr.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, DatePipe, FormsModule,
    IonButton, IonInput, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonItem, IonLabel, IonFab, IonFabButton]})

export class TimeliMngrComponent implements  OnInit, OnDestroy, AfterViewInit {
 
  @ViewChild('sliderContainer', { static: false }) sliderContainerRef?: ElementRef<HTMLDivElement>;

  formatedDate: string = '';

  defaultTimelineId = defaultTimelineId;

  timelinesMngr: TimelinesMngr = [];
  timelinesMngr$: Observable<TimelinesMngr> = this.bitsOfMyLifeStore.select(selectTimelinesMngr);

  selectedTimelineId: string = defaultTimelineId;
  selectedTimelineId$: Observable<string> = this.bitsOfMyLifeStore.select(selectSelectedTimelineId);

  private subTimelinesMngr?: Subscription;
  private subselectedTimelineId?: Subscription;

  newTimeline: Timeline = { id: '', name: '', mainDate: new Date()};
  isAddTimelineModalOpen = false;

  editingTimeline: Timeline = {id: '', name: '', mainDate: new Date() };
  isEditTimelineModalOpen = false;

  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>) {
      addIcons({ trash, create, pencil, add });
  }
  
  ngOnInit() {
    if (this.timelinesMngr$) {
      this.subTimelinesMngr = this.timelinesMngr$.subscribe((data) => {
        this.timelinesMngr = data;
        setTimeout(() => {
          this.scrollCardToCenter(this.selectedTimelineId);
        });
      });
    }

    if (this.selectedTimelineId$) {
      this.subselectedTimelineId = this.selectedTimelineId$.subscribe((id) => {
        if (id) {
          this.selectedTimelineId = id;
          setTimeout(() => {
            this.scrollCardToCenter(this.selectedTimelineId);
          });
        }
      });
    }
  }

  ngOnDestroy() {
    this.subselectedTimelineId?.unsubscribe();
    this.subTimelinesMngr?.unsubscribe();
  }

  ngAfterViewInit() {
  }

  private selectCard(timelineId: string) {
    const index = this.timelinesMngr.findIndex(t => t.id === timelineId);
    if (index !== -1 && this.selectedTimelineId !== timelineId) {      
      this.bitsOfMyLifeStore.dispatch(selectTimelineById({ timelineId }));
    }
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

  addTimeline(): void {
    this.newTimeline.mainDate = new Date();
    this.formatedDate = this.newTimeline.mainDate.toISOString().split('T')[0];
    this.isAddTimelineModalOpen = true;
  }

  closeEditTimelineDialog() {
    this.isEditTimelineModalOpen = false;
  }

  updateTimeline(): void {
      this.editingTimeline.mainDate = new Date(this.formatedDate);
      this.bitsOfMyLifeStore.dispatch(updateTimeline({ timelineToEdit: this.editingTimeline }));
      this.editingTimeline = {id: '', mainDate: new Date(), name: '' };  // Reset after update
      this.isEditTimelineModalOpen = false;
  }
  
  editTimelineById(timelineId: string): void {
    const index = this.timelinesMngr.findIndex(t => t.id === timelineId);
    if (index !== -1 && defaultTimelineId !== timelineId) {
      const timeline = this.timelinesMngr[index];
      this.editingTimeline = {id: timeline.id, mainDate: timeline.mainDate, name: timeline.name};
      this.formatedDate = this.editingTimeline.mainDate.toISOString().split('T')[0];
      this.isEditTimelineModalOpen = true;
    }
  }

  deleteTimelineById(timelineId: string) : void {
    // Not necessary to raise an error, but just to report in console
    // UI should not allow to delete default timeline
    if (timelineId === defaultTimelineId) {
      console.error('Invalid ID for delete Timeline');
      return
    }
    const userConfirmed = confirm('Sei sicuro di voler cancellare questa Timeline?');// ToDo: To localize
    if (userConfirmed) {
      this.bitsOfMyLifeStore.dispatch(deleteTimelineById({ timelineId }));
    }
  }

  private scrollTimeout: any;

  onScroll(event: Event) {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      this.handleScrollEnd();
    },100); // ⏳ 100 ms dopo l’ultimo scroll
  }

  private handleScrollEnd() {
    if (!this.sliderContainerRef) return;

    const container = this.sliderContainerRef.nativeElement as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + container.clientWidth / 2;

    let closestIndex = 0;
    let minDistance = Number.MAX_VALUE;
    let timelineId = "";

    this.timelinesMngr.forEach((timeline, i) => {
      const cardEl = document.getElementById(timeline.id);
      if (!cardEl) return;

      const cardRect = cardEl.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
        timelineId = timeline.id;
      }
    });

    this.selectCard(timelineId);
  }

  onCardClick(timelineId: string) {
      this.selectCard(timelineId);
  }

  private scrollCardToCenter(timelineId: string) {
    if (!this.sliderContainerRef) return;
    
    const index = this.timelinesMngr.findIndex(t => t.id === timelineId);
    if (index === -1) return;

    const container = this.sliderContainerRef.nativeElement;
    const cardEl = document.getElementById(timelineId);
    if (!cardEl) return;

    const containerCenter = container.clientWidth / 2;
    const cardCenter = cardEl.offsetLeft + cardEl.clientWidth / 2;
    const scrollLeft = cardCenter - containerCenter;

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
  }
}