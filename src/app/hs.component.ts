import { Component, Output, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';
import { GestureController, IonicModule, AnimationController } from '@ionic/angular';
import { CommonModule} from '@angular/common';

@Component({
    selector: 'app-horizontal-scroll',
    standalone: true,
    imports: [IonicModule, CommonModule],
    template: `
      <div class="page-container" #container>
        <div class="page-content" #content>
          <ng-content></ng-content>
        </div>
      </div>
    `,
    styles: [`
      .page-container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
      }
      
      .page-content {
        width: 100%;
        height: 100%;
        will-change: transform;
      }
    `]
  })
  export class PageTransitionComponent {
    @ViewChild('container') containerRef!: ElementRef<HTMLElement>;
    @ViewChild('content') contentRef!: ElementRef<HTMLElement>;
    
    @Output() swipeNext = new EventEmitter<void>();
    @Output() swipePrev = new EventEmitter<void>();
    
    // Opzioni configurabili
    @Input() threshold: number = 80; // Distanza minima per attivare lo swipe
    @Input() animationDuration: number = 300; // Durata dell'animazione in ms
    
    private gesture: any;
    private startX: number = 0;
    private containerWidth: number = 0;
    private transitioning: boolean = false;
    
    constructor() {}
    
    ngAfterViewInit() {
      setTimeout(() => {
        this.containerWidth = this.containerRef.nativeElement.clientWidth;
        this.setupGestures();
      }, 50);
      
      window.addEventListener('resize', this.onResize);
    }
    
    ngOnDestroy() {
      window.removeEventListener('resize', this.onResize);
    }
    
    private onResize = () => {
      this.containerWidth = this.containerRef.nativeElement.clientWidth;
    }
    
    private setupGestures() {
      // Utilizza l'API nativa dei browser per i tocchi
      const container = this.containerRef.nativeElement;
      const content = this.contentRef.nativeElement;
      
      // Gestione del tocco iniziale
      container.addEventListener('touchstart', (e) => {
        if (this.transitioning) return;
        
        this.startX = e.touches[0].clientX;
        content.style.transition = 'none';
      });
      
      // Gestione del movimento
      container.addEventListener('touchmove', (e) => {
        if (this.transitioning) return;
        
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - this.startX;
        
        // Calcola la resistenza per rallentare il movimento quando ci si avvicina ai bordi
        let resistance = 1;
        if (deltaX > 0 || deltaX < 0) {
          resistance = 0.5; // Resistenza minore per un movimento più fluido
        }
        
        content.style.transform = `translateX(${deltaX * resistance}px)`;
      });
      
      // Gestione del termine del tocco
      container.addEventListener('touchend', (e) => {
        if (this.transitioning) return;
        
        const currentX = e.changedTouches[0].clientX;
        const deltaX = currentX - this.startX;
        
        // Determina se lo swipe deve attivare un cambio pagina
        if (Math.abs(deltaX) > this.threshold) {
          if (deltaX > 0) {
            // Swipe da sinistra a destra (precedente)
            this.animateTransition('prev');
          } else {
            // Swipe da destra a sinistra (successivo)
            this.animateTransition('next');
          }
        } else {
          // Reset alla posizione originale se lo swipe non è abbastanza lungo
          this.resetPosition();
        }
      });
      
      // Supporto anche per il mouse (opzionale)
      let isDragging = false;
      
      container.addEventListener('mousedown', (e) => {
        if (this.transitioning) return;
        
        isDragging = true;
        this.startX = e.clientX;
        content.style.transition = 'none';
      });
      
      container.addEventListener('mousemove', (e) => {
        if (!isDragging || this.transitioning) return;
        
        const deltaX = e.clientX - this.startX;
        content.style.transform = `translateX(${deltaX * 0.5}px)`;
      });
      
      container.addEventListener('mouseup', (e) => {
        if (!isDragging || this.transitioning) return;
        
        isDragging = false;
        const deltaX = e.clientX - this.startX;
        
        if (Math.abs(deltaX) > this.threshold) {
          if (deltaX > 0) {
            this.animateTransition('prev');
          } else {
            this.animateTransition('next');
          }
        } else {
          this.resetPosition();
        }
      });
      
      container.addEventListener('mouseleave', () => {
        if (isDragging && !this.transitioning) {
          isDragging = false;
          this.resetPosition();
        }
      });
    }
    
    private animateTransition(direction: 'next' | 'prev') {
      this.transitioning = true;
      
      const content = this.contentRef.nativeElement;
      const targetPosition = direction === 'next' ? -this.containerWidth : this.containerWidth;
      
      // Prima parte dell'animazione: muovi il contenuto fuori dallo schermo
      content.style.transition = `transform ${this.animationDuration}ms ease-out`;
      content.style.transform = `translateX(${targetPosition}px)`;
      
      // Quando l'animazione è completa, emetti l'evento e prepara la prossima pagina
      setTimeout(() => {
        // Emetti l'evento appropriato
        if (direction === 'next') {
          this.swipeNext.emit();
        } else {
          this.swipePrev.emit();
        }
        
        // IMPORTANTE: Reset immediato del contenuto senza animazione
        // Questo viene fatto "dietro le quinte" mentre il contenuto è fuori dallo schermo
        content.style.transition = 'none';
        
        // Muovi il contenuto sul lato opposto (fuori dallo schermo)
        const startPosition = direction === 'next' ? this.containerWidth : -this.containerWidth;
        content.style.transform = `translateX(${startPosition}px)`;
        
        // Forza un reflow per assicurarsi che il browser applichi il cambio
        content.offsetHeight;
        
        // Seconda parte dell'animazione: fai scorrere il nuovo contenuto dentro
        setTimeout(() => {
          content.style.transition = `transform ${this.animationDuration}ms ease-out`;
          content.style.transform = 'translateX(0)';
          
          // Quando la seconda animazione è completa, ripristina lo stato normale
          setTimeout(() => {
            content.style.transition = 'none';
            this.transitioning = false;
          }, this.animationDuration);
        }, 20); // Un piccolo ritardo per assicurarsi che il reflow sia completato
      }, this.animationDuration);
    }
    
    private resetPosition() {
      const content = this.contentRef.nativeElement;
      
      content.style.transition = `transform ${this.animationDuration}ms ease-out`;
      content.style.transform = 'translateX(0)';
      
      setTimeout(() => {
        content.style.transition = 'none';
      }, this.animationDuration);
    }
    
    // Metodi pubblici per le transizioni programmatiche
    public triggerNextTransition() {
      if (this.transitioning) return;
      this.animateTransition('next');
    }
    
    public triggerPrevTransition() {
      if (this.transitioning) return;
      this.animateTransition('prev');
    }
  }