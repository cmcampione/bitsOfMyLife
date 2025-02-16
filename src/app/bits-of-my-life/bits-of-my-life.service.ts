import { Injectable } from '@angular/core';
import { BitsOfMyLifeState } from './bits-of-my-life.state';
import { initialBitsOfMyLifeState } from './bits-of-my-life.reducer';
import { Milestones, Milestone, MilestonesMngr, Timeline, TimelinesMngr, BitOfMyLife, MilestoneToAdd, MilestoneToEdit } from './bits-of-my-life.models';

@Injectable({
  providedIn: 'root'
})
export class BitsOfMyLifeService {

    private readonly storageKey = 'bitsOfMyLifeState';
  
    private serializeBitsOfMyLifeState(state: BitsOfMyLifeState): string {
      return JSON.stringify({
        version: state.version,
        milestoneIdCounter: state.milestoneIdCounter,
        milestonesMngr: Array.from(state.milestonesMngr.entries()), // Converte Map in array
        timelinesMngr: Array.from(state.timelinesMngr.entries()),  // Converte Map in array
        selectedMilestonesId: state.selectedMilestonesId,
        selectedTimelineId: state.selectedTimelineId
      });
    }
  
    private deserializeBitsOfMyLifeState(json: string): BitsOfMyLifeState {
      const parsed = JSON.parse(json);
  
      return {
        version: parsed.version,
        milestoneIdCounter: parsed.milestoneIdCounter,
        milestonesMngr: new Map(
          parsed.milestonesMngr.map(([id, milestones]: [number, Milestones]) => [
            id,
            {
              ...milestones,
              milestones: milestones.milestones.map((ms: Milestone) => ({
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
        selectedMilestonesId: parsed.selectedMilestonesId,
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
            throw new Error(`Errore critico durante il salvataggio dello stato`);
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
            throw new Error(`Errore critico durante il caricamento dello stato`);
        }
    }

    /**
     * Aggiunge una nuova `Milestone` allo stato.
     * @param milestoneToAdd Il nuovo elemento da aggiungere.
     * @returns Lo stato aggiornato.
     */
    async addMilestone(state: BitsOfMyLifeState, milestoneToAdd: MilestoneToAdd): Promise<MilestoneToAdd> {
      
      const newIdMilestone = state.milestoneIdCounter + 1;
      // Creazione del nuovo Milestone
      const newMilestone: Milestone = {
        id: newIdMilestone,
        date: milestoneToAdd.date,
        note: milestoneToAdd.note,
      };

      // Ottieni i traguardi selezionati
      const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
      if (!selectedMilestones) {
        throw new Error('Selected Milestones not found. Unable to add the milestone.');
      }

      // Aggiorna i traguardi selezionati con il nuovo Milestone
      const updatedMilestones: Milestones = {
        ...selectedMilestones,
        milestones: [...selectedMilestones.milestones, newMilestone],
      };

      // Crea un nuovo manager aggiornato
      const updatedMilestonesMngr = new Map(state.milestonesMngr).set(
        state.selectedMilestonesId,
        updatedMilestones
      );

      // Aggiorna lo stato
      const updatedState: BitsOfMyLifeState = {
        ...state,
        milestoneIdCounter: newIdMilestone,
        milestonesMngr: updatedMilestonesMngr,
      };

      // Salva lo stato aggiornato nel localStorage
      await this.saveState(updatedState);

      // Restituisce lo stato aggiornato
      return milestoneToAdd;
    }

    async editMilestone(state: BitsOfMyLifeState, milestoneToEdit: MilestoneToEdit): Promise<BitsOfMyLifeState> {
      // Ottieni i traguardi selezionati
      const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
      if (!selectedMilestones) {
        throw new Error('Selected Milestones not found. Unable to edit the milestone.');
      }
    
      // Trova il traguardo da modificare
      const milestoneIndex = selectedMilestones.milestones.findIndex((milestone) => milestone.id === milestoneToEdit.id);
      if (milestoneIndex === -1) {
        throw new Error('Milestone not found. Unable to edit the milestone.');
      }
    
      // Crea il nuovo traguardo con i dati modificati
      const updatedMilestone: Milestone = {
        ...selectedMilestones.milestones[milestoneIndex],
        date: milestoneToEdit.date,
        note: milestoneToEdit.note,
      };
    
      // Aggiorna la lista dei traguardi
      const updatedMilestones: Milestones = {
        ...selectedMilestones,
        milestones: [
          ...selectedMilestones.milestones.slice(0, milestoneIndex),
          updatedMilestone,
          ...selectedMilestones.milestones.slice(milestoneIndex + 1),
        ],
      };
    
      // Crea un nuovo manager aggiornato
      const updatedMilestonesMngr = new Map(state.milestonesMngr).set(
        state.selectedMilestonesId,
        updatedMilestones
      );
    
      // Aggiorna lo stato
      const updatedState: BitsOfMyLifeState = {
        ...state,
        milestonesMngr: updatedMilestonesMngr,
      };
    
      // Salva lo stato aggiornato nel localStorage
      await this.saveState(updatedState);
    
      // Restituisce lo stato aggiornato
      return updatedState;
    }

    /**
   * Rimuove una `Milestone` dallo stato dato il suo ID.
   * @param state Lo stato attuale.
   * @param milestoneId L'ID della milestone da rimuovere.
   * @returns Lo stato aggiornato.
   */
    async deleteMilestone(state: BitsOfMyLifeState, milestoneId: number): Promise<BitsOfMyLifeState> {
      // Trova i traguardi selezionati
      const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
      if (!selectedMilestones) {
        throw new Error('Selected Milestones not found. Unable to remove the milestone.');
      }

      // Filtra per rimuovere la milestone con l'ID specificato
      const filteredMilestones = selectedMilestones.milestones.filter(
        (milestone) => milestone.id !== milestoneId
      );

      // Aggiorna i traguardi selezionati
      const updatedMilestones: Milestones = {
        ...selectedMilestones,
        milestones: filteredMilestones,
      };

      // Crea un nuovo manager aggiornato
      const updatedMilestonesMngr = new Map(state.milestonesMngr).set(
        state.selectedMilestonesId,
        updatedMilestones
      );

      // Aggiorna lo stato
      const updatedState: BitsOfMyLifeState = {
        ...state,
        milestonesMngr: updatedMilestonesMngr,
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
  