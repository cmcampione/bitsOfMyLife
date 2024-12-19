import { Injectable } from '@angular/core';
import { BitsOfMyLifeState } from './bits-of-my-life.state';
import { initialBitsOfMyLifeState } from './bits-of-my-life.reducer';
import { MileStones, MileStone, MileStonesMngr, Timeline, TimelinesMngr } from './bits-of-my-life.models';

@Injectable({
  providedIn: 'root'
})
export class BitsOfMyLifeService {

    private readonly storageKey = 'bitsOfMyLifeState';
  
    private serializeBitsOfMyLifeState(state: BitsOfMyLifeState): string {
      return JSON.stringify({
        mileStonesMngr: Array.from(state.mileStonesMngr.entries()), // Converte Map in array
        timelinesMngr: Array.from(state.timelinesMngr.entries()),  // Converte Map in array
        selectedMileStonesId: state.selectedMileStonesId,
        selectedTimelineId: state.selectedTimelineId
      });
    }
  
    private deserializeBitsOfMyLifeState(json: string): BitsOfMyLifeState {
      const parsed = JSON.parse(json);
  
      return {
        mileStonesMngr: new Map(
          parsed.mileStonesMngr.map(([id, milestones]: [number, MileStones]) => [
            id,
            {
              ...milestones,
              mileStones: milestones.mileStones.map((ms: MileStone) => ({
                ...ms,
                date: new Date(ms.date) // Converte stringa ISO in Date
              }))
            }
          ])
        ) as MileStonesMngr,
        timelinesMngr: new Map(
          parsed.timelinesMngr.map(([id, timeline]: [number, Timeline]) => [
            id,
            {
              ...timeline,
              mainDate: new Date(timeline.mainDate) // Converte stringa ISO in Date
            }
          ])
        ) as TimelinesMngr,
        selectedMileStonesId: parsed.selectedMileStonesId,
        selectedTimelineId: parsed.selectedTimelineId
      };
    }
  
    /** Salva lo stato corrente nel localStorage in modo asincrono.
    * @param state Stato da salvare.
    */

   async saveState(state: BitsOfMyLifeState): Promise<void> {
       try {
           const serializedState = this.serializeBitsOfMyLifeState(state);
           await Promise.resolve(localStorage.setItem(this.storageKey, serializedState));
       } catch (error) {
           console.error('Errore durante il salvataggio dello stato:', error);
           // Rilancia l'eccezione per essere gestita dal chiamante
           throw new Error('Errore critico durante il salvataggio dello stato.');
       }
   }
   
   /**
    * Carica lo stato dal localStorage in modo asincrono.
    * @returns Lo stato deserializzato oppure un oggetto vuoto predefinito.
    */
   async loadState(): Promise<BitsOfMyLifeState> {
       try {
           const serializedState = await Promise.resolve(localStorage.getItem(this.storageKey));
           if (serializedState) {
               return this.deserializeBitsOfMyLifeState(serializedState);
           }
           // Nessun dato salvato, restituisci lo stato predefinito
           return this.getDefaultState();
       } catch (error) {
           console.error('Errore durante il caricamento dello stato:', error);
   
           // Se è un problema di parsing o accesso, rilancia l'eccezione
           throw new Error('Errore critico durante il caricamento dello stato.');
       }
   }
   
  
    /**
     * Cancella lo stato dal localStorage in modo asincrono.
     */
    async clearState(): Promise<void> {
      await Promise.resolve(localStorage.removeItem(this.storageKey));
    }
  
    /**
     * Ritorna uno stato predefinito.
     * @returns Stato predefinito.
     */
    private getDefaultState(): BitsOfMyLifeState {
      return initialBitsOfMyLifeState;
    }
  }
  