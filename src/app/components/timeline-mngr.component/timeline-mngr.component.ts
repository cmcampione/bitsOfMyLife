import {
  AfterViewInit,
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
import { NgFor, DatePipe} from '@angular/common';
import { IonCard, IonCardSubtitle, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { TimelinesMngr } from '../../bits-of-my-life/bits-of-my-life.models';

@Component({
    selector: 'app-timeline-manager',
    templateUrl: './timeline-mngr.component.html',
    styleUrls: ['./timeline-mngr.component.scss'],
    standalone: true,
    imports: [NgFor, DatePipe,
      IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle]})

export class TimeliMngrComponent implements  OnInit, OnDestroy {
  @Input() timelinesMngr$: Observable<TimelinesMngr> | null = null;
  @Input() selectedIndex = 0;
  @Output() timelineIndex = new EventEmitter<number>();

  @ViewChildren('cardEl', { read: ElementRef }) cardElements!: QueryList<ElementRef>;

  timelinesMngr: TimelinesMngr = [];

  private sub?: Subscription;

  ngOnInit() {
    if (this.timelinesMngr$) {
      this.sub = this.timelinesMngr$.subscribe((data) => {
        this.timelinesMngr = data;
        if (this.timelinesMngr.length > 0) {
          this.selectCard(0);
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

    this.selectCard(closestIndex);
  }

  selectCard(index: number) {
    if (this.selectedIndex !== index && this.timelinesMngr[index]) {
      this.selectedIndex = index;
      this.timelineIndex.emit(index);
    }
  }
}

