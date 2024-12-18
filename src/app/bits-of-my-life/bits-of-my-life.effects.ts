import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { catchError, from, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { BitsOfMyLifeService } from "./bits-of-my-life.service";
import { loadState, stateLoaded, saveState, clearState, stateSaved } from "./bits-of-my-life.actions";
import { selectBitsOfMyLifeState } from "./bits-of-my-life.selectors";
import { updateAppState } from "../global/globalMng";

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
            switchMap(() => 
                from(this.bitsOfMyLifeService.loadState()).pipe(
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
            )
        )
    );

    saveState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(saveState),
            withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
            switchMap(([_, currentState]) =>
                from(this.bitsOfMyLifeService.saveState(currentState)).pipe(
                    map(() => stateSaved({ state: currentState })), // Dispatch di successo
                    catchError(error => {
                        console.error('Errore durante il salvataggio dello stato:', error);
                        return of(updateAppState({
                            state: {
                                error: {
                                    code: 2,
                                    description: "Errore durante il salvataggio dello stato",
                                },
                            },
                        }));
                    })
                )
            )
        )
    );

    clearState$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(clearState),
                switchMap(() => 
                    from(this.bitsOfMyLifeService.clearState()).pipe(
                        catchError(error => {
                            console.error('Errore durante la cancellazione dello stato:', error);
                            return of(updateAppState({
                                state: {
                                    error: {
                                        code: 3,
                                        description: "Errore durante la cancellazione dello stato",
                                    },
                                },
                            }));
                        })
                    )
                )
            ),
        { dispatch: false }
    );
}
