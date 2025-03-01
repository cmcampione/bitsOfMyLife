import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { catchError, from, map, of, switchMap, withLatestFrom } from "rxjs";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { BitsOfMyLifeService } from "./bits-of-my-life.service";
import { loadState, stateLoaded, saveState, clearState, stateSaved, addMilestone, 
    milestoneAdded, deleteMilestone, milestoneDeleted, editMilestone, milestoneEdited, 
    selectOrAddNextTimeline, timelineSelectedOrAdded, selectOrAddPrevTimeline, 
    editSelectedTimeline,
    selectedTimelineEdited,
    deleteSelectedTimeline,
    selectedTimelineDeleted} from "./bits-of-my-life.actions";
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
                        return of(updateAppState({
                            state: {
                                error
                            }
                        }));
                    })
                )
            )
        )
    );

    // Todo: To check, don't know if useful
    saveState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(saveState),
            withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
            switchMap(([_, currentState]) =>
                from(this.bitsOfMyLifeService.saveState(currentState)).pipe(
                    map(() => stateSaved({ state: currentState })), // Dispatch di successo
                    catchError(error => {
                        return of(updateAppState({
                            state: {
                                error
                            },
                        }));
                    })
                )
            )
        )
    );

    // Todo: To check, don't know if useful
    clearState$ = createEffect(() =>
            this.actions$.pipe(
                ofType(clearState),
                switchMap(() => 
                    from(this.bitsOfMyLifeService.clearState()).pipe(
                        catchError(error => {
                            return of(updateAppState({
                                state: {
                                    error
                                },
                            }));
                        })
                    )
                )
            ),
        { dispatch: false }
    );
    
    addMilestone$ = createEffect(() =>
        this.actions$.pipe(
        ofType(addMilestone),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
        switchMap(([{ milestoneToAdd }, currentState]) =>
            from(this.bitsOfMyLifeService.addMilestone(currentState, milestoneToAdd)).pipe(
            map((newMilestone) => milestoneAdded({ newMilestone: newMilestone })),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        error
                    },
                }));
            })))
        )
    );

    editMilestone$ = createEffect(() =>
        this.actions$.pipe(
        ofType(editMilestone),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
        switchMap(([{ milestoneToEdit }, currentState]) =>
            from(this.bitsOfMyLifeService.editMilestone(currentState, milestoneToEdit)).pipe(
            map((updatedMilestone) => milestoneEdited({ updatedMilestone })),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        error
                    },
                }));
            })))
        )
    );

    deleteMilestone$ = createEffect(() =>
        this.actions$.pipe(
        ofType(deleteMilestone),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
        switchMap(([{ milestoneIdToRemove }, currentState]) =>
            from(this.bitsOfMyLifeService.deleteMilestone(currentState, milestoneIdToRemove)).pipe(
            map((milestoneIdToRemove) => milestoneDeleted({ milestoneIdToRemove })),
            catchError((error) => {
                console.error('Errore durante la cancellazione di un BitOfMyLife:', error);
                return of(updateAppState({
                    state: {
                        error
                    },
                }));
            })))
        )
    );

    editSelectedTimeline$ = createEffect(() =>
        this.actions$.pipe(
        ofType(editSelectedTimeline),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
        switchMap(([{ timelineToEdit }, currentState]) =>
            from(this.bitsOfMyLifeService.editSelectedTimeline(currentState, timelineToEdit)).pipe(
            map((updatedTimeline) => selectedTimelineEdited({ updatedTimeline })),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        error
                    },
                }));
            })))
        )
    );

    deleteSelectedTimeline$ = createEffect(() =>
        this.actions$.pipe(
        ofType(deleteSelectedTimeline),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
        switchMap(([{  }, currentState]) =>
            from(this.bitsOfMyLifeService.deleteSelectedTimeline(currentState)).pipe(
            map((timelineIdToRemove) => selectedTimelineDeleted({ timelineIdToRemove })),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        error                    },
                }));
            })))
        )
    );

    selectOrAddNextTimeline$ = createEffect(() =>
        this.actions$.pipe(
        ofType(selectOrAddNextTimeline),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
        switchMap(([{ }, currentState]) =>
            from(this.bitsOfMyLifeService.selectOrAddNextTimeline(currentState)).pipe(
            map((selectedOrCreatedTimeline) => timelineSelectedOrAdded(selectedOrCreatedTimeline)),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        error
                    },
                }));
            })))
        )
    );

    selectOrAddPrevTimeline$ = createEffect(() =>
        this.actions$.pipe(
        ofType(selectOrAddPrevTimeline),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
        switchMap(([{ }, currentState]) =>
            from(this.bitsOfMyLifeService.selectOrAddPrevTimeline(currentState)).pipe(
            map((selectedTimeline) => timelineSelectedOrAdded(selectedTimeline)),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        error
                    },
                }));
            })))
        )
    );
}
