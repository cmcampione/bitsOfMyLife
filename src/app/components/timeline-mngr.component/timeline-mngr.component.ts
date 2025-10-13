import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { NgFor, NgIf, DatePipe} from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { IonButton, IonIcon, IonCard, IonCardSubtitle, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, create, pencil, add } from 'ionicons/icons';
import { TimelinesMngr } from '../../bits-of-my-life/bits-of-my-life.models';
import { defaultTimelineId, defaultTimelineIndex } from '../../bits-of-my-life/bits-of-my-life.reducer';

@Component({
    selector: 'app-timeline-manager',
    templateUrl: './timeline-mngr.component.html',
    styleUrls: ['./timeline-mngr.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, DatePipe,
    IonButton, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent]})

export class TimeliMngrComponent implements  OnInit, OnDestroy {
  @Input() timelinesMngr$: Observable<TimelinesMngr> | null = null;
  @Input() selectedTimelineId: string = "";
  @Output() timelineIdSelected = new EventEmitter<string>();

  @ViewChildren('cardEl', { read: ElementRef }) cardElements!: QueryList<ElementRef>;

  defaultTimelineIndex = defaultTimelineIndex;
  defaultTimelineId = defaultTimelineId;

  timelinesMngr: TimelinesMngr = [];

  private sub?: Subscription;

  constructor() {
      addIcons({ trash, create, pencil, add });
  }
  
  ngOnInit() {
    if (this.timelinesMngr$) {
      this.sub = this.timelinesMngr$.subscribe((data) => {
        this.timelinesMngr = data;
        if (this.timelinesMngr.length > 0) {
          this.selectCard(this.selectedTimelineId);
        }
      });
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onScroll(event: any) {
    const scrollContainer = event.target;
    const containerCenter = scrollContainer.clientHeight / 2;
    let closestIndex = 0;
    let closestDistance = Number.MAX_VALUE;

    this.cardElements.forEach((el, index) => {
      const cardRect = el.nativeElement.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const cardCenter = cardRect.top - containerRect.top + cardRect.height / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    const closestId = this.timelinesMngr[closestIndex]?.id;
    if (closestId) {
      this.selectCard(closestId);
    }
  }

  selectCard(id: string) {
  
    const index = this.timelinesMngr.findIndex(t => t.id === id);

    if (index !== -1 && this.selectedTimelineId !== id) {
      
      this.selectedTimelineId = id;
      this.timelineIdSelected.emit(id);
    }
}

  editSelectedTimeline(): void {
  }

  deleteSelectedTimeline() : void {
  }
}

