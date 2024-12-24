import { Injectable } from '@angular/core';
import { BitsOfMyLifeState } from './bits-of-my-life.state';
import { initialBitsOfMyLifeState } from './bits-of-my-life.reducer';
import { Milestones, Milestone, MilestonesMngr, Timeline, TimelinesMngr, BitOfMyLife, BitOfMyLifeToAdd, BitOfMyLifeToEdit } from './bits-of-my-life.models';

@Injectable({
  providedIn: 'root'
})
export class BitsOfMyLifeService {

    private readonly storageKey = 'bitsOfMyLifeState';
  
    private serializeBitsOfMyLifeState(state: BitsOfMyLifeState): string {
      return JSON.stringify({
        milestoneIdCounter: state.milestoneIdCounter,
        mileStonesMngr: Array.from(state.mileStonesMngr.entries()), // Converte Map in array
        timelinesMngr: Array.from(state.timelinesMngr.entries()),  // Converte Map in array
        selectedMileStonesId: state.selectedMileStonesId,
        selectedTimelineId: state.selectedTimelineId
      });
    }
  
    private deserializeBitsOfMyLifeState(json: string): BitsOfMyLifeState {
      const parsed = JSON.parse(json);
  
      return {
        milestoneIdCounter: parsed.milestoneIdCounter,
        mileStonesMngr: new Map(
          parsed.mileStonesMngr.map(([id, milestones]: [number, Milestones]) => [
            id,
            {
              ...milestones,
              mileStones: milestones.milestones.map((ms: Milestone) => ({
                ...ms,
                date: new Date(ms.date) // Converte stringa ISO in Date
              }))
            }
          ])
        ) as MilestonesMngr,
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
     * Aggiunge un nuovo `BitOfMyLife` allo stato.
     * @param bitOfMyLife Il nuovo elemento da aggiungere.
     * @returns Lo stato aggiornato.
     */
    async addBitOfMyLife(state: BitsOfMyLifeState, bitOfMyLife: BitOfMyLifeToAdd): Promise<BitsOfMyLifeState> {
      
      const newIdMilestone = state.milestoneIdCounter + 1;
      // Creazione del nuovo MileStone
      const newMileStone: Milestone = {
        id: newIdMilestone,
        date: bitOfMyLife.date,
        note: bitOfMyLife.note,
      };

      // Ottieni i traguardi selezionati
      const selectedMilestones = state.mileStonesMngr.get(state.selectedMileStonesId);
      if (!selectedMilestones) {
        throw new Error('Selected MileStones not found. Unable to add the milestone.');
      }

      // Aggiorna i traguardi selezionati con il nuovo MileStone
      const updatedMilestones: Milestones = {
        ...selectedMilestones,
        milestones: [...selectedMilestones.milestones, newMileStone],
      };

      // Crea un nuovo manager aggiornato
      const updatedMilestonesMngr = new Map(state.mileStonesMngr).set(
        state.selectedMileStonesId,
        updatedMilestones
      );

      // Aggiorna lo stato
      const updatedState: BitsOfMyLifeState = {
        ...state,
        milestoneIdCounter: newIdMilestone,
        mileStonesMngr: updatedMilestonesMngr,
      };

      // Salva lo stato aggiornato nel localStorage
      await this.saveState(updatedState);

      // Restituisce lo stato aggiornato
      return updatedState;
    }

    async editBitOfMyLife(state: BitsOfMyLifeState, bitOfMyLife: BitOfMyLifeToEdit): Promise<BitsOfMyLifeState> {
      // Ottieni i traguardi selezionati
      const selectedMilestones = state.mileStonesMngr.get(state.selectedMileStonesId);
      if (!selectedMilestones) {
        throw new Error('Selected MileStones not found. Unable to edit the milestone.');
      }
    
      // Trova il traguardo da modificare
      const milestoneIndex = selectedMilestones.milestones.findIndex((milestone) => milestone.id === bitOfMyLife.id);
      if (milestoneIndex === -1) {
        throw new Error('Milestone not found. Unable to edit the milestone.');
      }
    
      // Crea il nuovo traguardo con i dati modificati
      const updatedMileStone: Milestone = {
        ...selectedMilestones.milestones[milestoneIndex],
        date: bitOfMyLife.date,
        note: bitOfMyLife.note,
      };
    
      // Aggiorna la lista dei traguardi
      const updatedMilestones: Milestones = {
        ...selectedMilestones,
        milestones: [
          ...selectedMilestones.milestones.slice(0, milestoneIndex),
          updatedMileStone,
          ...selectedMilestones.milestones.slice(milestoneIndex + 1),
        ],
      };
    
      // Crea un nuovo manager aggiornato
      const updatedMilestonesMngr = new Map(state.mileStonesMngr).set(
        state.selectedMileStonesId,
        updatedMilestones
      );
    
      // Aggiorna lo stato
      const updatedState: BitsOfMyLifeState = {
        ...state,
        mileStonesMngr: updatedMilestonesMngr,
      };
    
      // Salva lo stato aggiornato nel localStorage
      await this.saveState(updatedState);
    
      // Restituisce lo stato aggiornato
      return updatedState;
    }

    /**
   * Rimuove un `BitOfMyLife` dallo stato dato il suo ID.
   * @param state Lo stato attuale.
   * @param bitOfMyLifeId L'ID della milestone da rimuovere.
   * @returns Lo stato aggiornato.
   */
    async deleteBitOfMyLife(state: BitsOfMyLifeState, bitOfMyLifeId: number): Promise<BitsOfMyLifeState> {
      // Trova i traguardi selezionati
      const selectedMileStones = state.mileStonesMngr.get(state.selectedMileStonesId);
      if (!selectedMileStones) {
        throw new Error('Selected MileStones not found. Unable to remove the milestone.');
      }

      // Filtra per rimuovere la milestone con l'ID specificato
      const updatedMilestones = selectedMileStones.milestones.filter(
        (milestone) => milestone.id !== bitOfMyLifeId
      );

      // Aggiorna i traguardi selezionati
      const updatedMileStones: Milestones = {
        ...selectedMileStones,
        milestones: updatedMilestones,
      };

      // Crea un nuovo manager aggiornato
      const updatedMileStonesMngr = new Map(state.mileStonesMngr).set(
        state.selectedMileStonesId,
        updatedMileStones
      );

      // Aggiorna lo stato
      const updatedState: BitsOfMyLifeState = {
        ...state,
        mileStonesMngr: updatedMileStonesMngr,
      };

      // Salva lo stato aggiornato nel localStorage
      await this.saveState(updatedState);

      // Restituisce lo stato aggiornato
      return updatedState;
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
  