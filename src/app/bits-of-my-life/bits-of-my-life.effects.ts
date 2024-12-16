import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { catchError, map, of, tap, withLatestFrom } from "rxjs";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { BitsOfMyLifeService } from "./bits-of-my-life.service";
import { loadState, stateLoaded, saveState, clearState, stateSaved } from "./bits-of-my-life.actions";
import { selectBitsOfMyLifeState } from "./bits-of-my-life.selectors";
import { AppState, updateAppState } from "../global/globalMng";

// Effects
@Injectable()
export class BitsOfMyLifeEffects {
    constructor(
        private actions$: Actions,
        private bitsOfMyLifeService: BitsOfMyLifeService,
        private store: Store
    ) {}

    loadState$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loadState),
            map(() => this.bitsOfMyLifeService.loadState()),
            map(state => stateLoaded({ state })),
            catchError(error => {
                console.error('Errore durante il caricamento dello stato:', error);
                return of(updateAppState({
                    state: {
                        error: {
                            code: 1,
                            description: "Errore durante il caricamento dello stato"
                        }
                    }
                }));
            })
        )
    );

    saveState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(saveState),
            withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
            tap(([, currentState]) => this.bitsOfMyLifeService.saveState(currentState)), // Esegue l'operazione di salvataggio),            
            map(() => stateSaved()),
            catchError(error => {
                console.error('Error saving state:', error);
                return of(updateAppState({
                    state: {
                        error: {
                            code: 2,
                            description: "Errore durante il salvataggio dello stato"
                        }
                    }
                }));
            })
        )
    );    

    clearState$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(clearState),
                tap(() => {
                    this.bitsOfMyLifeService.clearState();
                })
            ),
        { dispatch: false }
    );
}
