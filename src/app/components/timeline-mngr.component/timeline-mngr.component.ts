import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { NgFor, NgIf, DatePipe} from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { IonButton, IonIcon, IonCard, IonCardSubtitle, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, create, pencil, add } from 'ionicons/icons';
import { TimelinesMngr } from '../../bits-of-my-life/bits-of-my-life.models';
import { defaultTimelineId } from '../../bits-of-my-life/bits-of-my-life.reducer';
import { selectSelectedTimelineId, selectTimelinesMngr } from '../../bits-of-my-life/bits-of-my-life.selectors';
import { BitsOfMyLifeState } from '../../bits-of-my-life/bits-of-my-life.state';
import { Store } from '@ngrx/store';
import { deleteTimelineById, selectTimelineById } from '../../bits-of-my-life/bits-of-my-life.actions';

@Component({
    selector: 'app-timeline-manager',
    templateUrl: './timeline-mngr.component.html',
    styleUrls: ['./timeline-mngr.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, DatePipe,
    IonButton, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent]})

export class TimeliMngrComponent implements  OnInit, OnDestroy {

  @ViewChildren('cardEl', { read: ElementRef }) cardElements!: QueryList<ElementRef>;

  defaultTimelineId = defaultTimelineId;

  timelinesMngr: TimelinesMngr = [];
  timelinesMngr$: Observable<TimelinesMngr> = this.bitsOfMyLifeStore.select(selectTimelinesMngr);

  selectedTimelineId: string = defaultTimelineId;
  selectedTimelineId$: Observable<string> = this.bitsOfMyLifeStore.select(selectSelectedTimelineId);

  private subTimelinesMngr?: Subscription;
  private subselectedTimelineId?: Subscription;

  constructor(private bitsOfMyLifeStore: Store<BitsOfMyLifeState>) {
      addIcons({ trash, create, pencil, add });
  }
  
  ngOnInit() {
    if (this.timelinesMngr$) {
      this.subTimelinesMngr = this.timelinesMngr$.subscribe((data) => {
        this.timelinesMngr = data;
        if (this.timelinesMngr.length > 0) {
          this.selectCard(this.selectedTimelineId);
        }
      });
    }
    if (this.selectedTimelineId$) {
      this.subselectedTimelineId = this.selectedTimelineId$.subscribe((id) => {
        if (id) {
          this.selectedTimelineId = id;
          this.selectCard(id);
        }
      });
    }
  }

  ngOnDestroy() {
    this.subselectedTimelineId?.unsubscribe();
    this.subTimelinesMngr?.unsubscribe();
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

  selectCard(timelineId: string) {
    const index = this.timelinesMngr.findIndex(t => t.id === timelineId);
    if (index !== -1 && this.selectedTimelineId !== timelineId) {      
      this.selectedTimelineId = timelineId;
      this.bitsOfMyLifeStore.dispatch(selectTimelineById({  timelineId }));
    }
  }

  editSelectedTimeline(): void {
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
}

