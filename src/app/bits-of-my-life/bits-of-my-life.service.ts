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
    /**
     * Salva lo stato corrente nel localStorage.
     * @param state Stato da salvare.
     */
    saveState(state: BitsOfMyLifeState): void {
        const serializedState = this.serializeBitsOfMyLifeState(state);
        localStorage.setItem(this.storageKey, serializedState);
    }

    /**
     * Carica lo stato dal localStorage.
     * @returns Lo stato deserializzato oppure un oggetto vuoto predefinito.
     */
    loadState(): BitsOfMyLifeState {
        const serializedState = localStorage.getItem(this.storageKey);
        if (serializedState) {
            try {
                return this.deserializeBitsOfMyLifeState(serializedState) as BitsOfMyLifeState;
            } catch (error) {
                console.error('Errore durante il parsing dello stato salvato:', error);
                return this.getDefaultState();
            }
        }
        return this.getDefaultState();
    }

    /**
     * Cancella lo stato dal localStorage.
     */
    clearState(): void {
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Ritorna uno stato predefinito.
     * @returns Stato predefinito.
     */
    private getDefaultState(): BitsOfMyLifeState {
        return initialBitsOfMyLifeState;
    }
}
