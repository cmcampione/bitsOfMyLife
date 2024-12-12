import { Injectable } from '@angular/core';
import { BitsOfMyLifeState } from './bits-of-my-life.state';
import { initialBitsOfMyLifeState } from './bits-of-my-life.reducer';

@Injectable({
  providedIn: 'root'
})
export class BitsOfMyLifeService {

  private readonly storageKey = 'bitsOfMyLifeState';

    /**
     * Salva lo stato corrente nel localStorage.
     * @param state Stato da salvare.
     */
    saveState(state: BitsOfMyLifeState): void {
        const serializedState = JSON.stringify(state);
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
                return JSON.parse(serializedState) as BitsOfMyLifeState;
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
