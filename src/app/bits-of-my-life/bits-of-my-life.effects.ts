import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { catchError, from, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { BitsOfMyLifeService } from "./bits-of-my-life.service";
import { loadState, stateLoaded, saveState, clearState, stateSaved, addBitOfMyLife, bitOfMyLifeAdded, deleteBitOfMyLife, bitOfMyLifeDeleted } from "./bits-of-my-life.actions";
import { selectBitsOfMyLifeState } from "./bits-of-my-life.selectors";
import { updateAppState } from "../global/globalMng";
import { BitOfMyLifeToAdd, Milestone, Milestones } from "./bits-of-my-life.models";
import { BitsOfMyLifeState } from "./bits-of-my-life.state";

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

    clearState$ = createEffect(() =>
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
    // Effect per l'aggiunta di un nuovo BitOfMyLife
    addBitOfMyLife$ = createEffect(() =>
        this.actions$.pipe(
        ofType(addBitOfMyLife),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
        switchMap(([{ bitOfMyLife }, currentState]) =>
            from(this.bitsOfMyLifeService.addBitOfMyLife(currentState, bitOfMyLife)).pipe(
            map((updatedState) => bitOfMyLifeAdded({ state: updatedState })),
            catchError((error) => {
                console.error("Errore durante l'aggiunta di un BitOfMyLife:", error);
                return of(updateAppState({
                    state: {
                        error: {
                            code: 4,
                            description: "Errore durante l'aggiunta di un BitOfMyLife",
                        },
                    },
                }));
            })))
        )
    );

    deleteBitOfMyLife$ = createEffect(() =>
        this.actions$.pipe(
        ofType(deleteBitOfMyLife),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
        switchMap(([{ id }, currentState]) =>
            from(this.bitsOfMyLifeService.deleteBitOfMyLife(currentState, id)).pipe(
            map((updatedState) => bitOfMyLifeDeleted({ state: updatedState })),
            catchError((error) => {
                console.error('Errore durante la cancellazione di un BitOfMyLife:', error);
                return of(updateAppState({
                    state: {
                        error: {
                            code: 5,
                            description: 'Errore durante la cancellazione di un BitOfMyLife',
                        },
                    },
                }));
            })))
        )
    );
}
