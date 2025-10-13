import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { catchError, from, map, of, switchMap, combineLatest, withLatestFrom } from "rxjs";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { BitsOfMyLifeService } from "./bits-of-my-life.service";
import { loadState, stateLoaded, saveState, clearState, stateSaved, addMilestone, 
    milestoneAdded, deleteMilestone, milestoneDeleted, editMilestone, milestoneEdited, 
    selectOrAddNextTimeline, timelineSelectedOrAdded, selectOrAddPrevTimeline, 
    editSelectedTimeline,
    selectedTimelineEdited,
    deleteSelectedTimeline,
    selectedTimelineDeleted,
    selectTimelineById,
    timelineSelected,
    deleteTimelineById,
    timelineDeleted} from "./bits-of-my-life.actions";
import { selectBitsOfMyLifeState } from "./bits-of-my-life.selectors";
import { selectAppState, updateAppState } from "../global/globalMng";

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
            switchMap(() => this.store.select(selectAppState).pipe(
                switchMap(appState => 
                    from(this.bitsOfMyLifeService.loadState()).pipe(
                        map(state => stateLoaded({ state })),
                        catchError(error => of(updateAppState({ state: { ...appState, error } }))))
                    )
                )
            )
        )
    )

    // Todo: To check, don't know if useful
    saveState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(saveState),
            switchMap(() => combineLatest([
                this.store.select(selectBitsOfMyLifeState), 
                this.store.select(selectAppState)
            ])),
            switchMap(([currentState, appState]) =>
                from(this.bitsOfMyLifeService.saveState(currentState)).pipe(
                    map(() => stateSaved({ state: currentState })), // Dispatch di successo
                    catchError(error => of(updateAppState({ state: { ...appState, error } })))
                )
            )
        )
    );

    // Todo: To check, don't know if useful
    clearState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(clearState),
            switchMap(() => this.store.select(selectAppState)), // Converte la Promise in Observable
            switchMap(appState => 
                from(this.bitsOfMyLifeService.clearState()).pipe(
                    catchError(error => of(updateAppState({ state: { ...appState, error } })))
                )
            )
        ),
        { dispatch: false }
    );
        
    addMilestone$ = createEffect(() =>
        this.actions$.pipe(
        ofType(addMilestone),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState), this.store.select(selectAppState)),
        switchMap(([{ milestoneToAdd }, currentState, appState]) =>
            from(this.bitsOfMyLifeService.addMilestone(currentState, milestoneToAdd)).pipe(
            map((newMilestone) => milestoneAdded({ newMilestone: newMilestone })),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        ...appState,
                        error
                    },
                }));
            })))
        )
    );

    editMilestone$ = createEffect(() =>
        this.actions$.pipe(
        ofType(editMilestone),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState), this.store.select(selectAppState)),
        switchMap(([{ milestoneToEdit }, currentState, appState]) =>
            from(this.bitsOfMyLifeService.editMilestone(currentState, milestoneToEdit)).pipe(
            map((updatedMilestone) => milestoneEdited({ updatedMilestone })),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        ...appState,
                        error
                    },
                }));
            })))
        )
    );

    deleteMilestone$ = createEffect(() =>
        this.actions$.pipe(
        ofType(deleteMilestone),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState), this.store.select(selectAppState)),
        switchMap(([{ milestoneIdToRemove }, currentState, appState]) =>
            from(this.bitsOfMyLifeService.deleteMilestone(currentState, milestoneIdToRemove)).pipe(
            map((milestoneIdToRemove) => milestoneDeleted({ milestoneIdToRemove })),
            catchError((error) => {
                console.error('Errore durante la cancellazione di un BitOfMyLife:', error);
                return of(updateAppState({
                    state: {
                        ...appState,
                        error
                    },
                }));
            })))
        )
    );

    editSelectedTimeline$ = createEffect(() =>
        this.actions$.pipe(
        ofType(editSelectedTimeline),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState), this.store.select(selectAppState)),
        switchMap(([{ timelineToEdit }, currentState, appState]) =>
            from(this.bitsOfMyLifeService.editSelectedTimeline(currentState, timelineToEdit)).pipe(
            map((updatedTimeline) => selectedTimelineEdited({ updatedTimeline })),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        ...appState,
                        error
                    },
                }));
            })))
        )
    );

    deleteSelectedTimeline$ = createEffect(() =>
        this.actions$.pipe(
        ofType(deleteSelectedTimeline),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState), this.store.select(selectAppState)),
        switchMap(([, currentState, appState]) =>
            from(this.bitsOfMyLifeService.deleteSelectedTimeline(currentState)).pipe(
            map((timelineIdToRemove) => selectedTimelineDeleted({ timelineIdToRemove })),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        ...appState,
                        error
                    },
                }));
            })))
        )
    );

    selectOrAddNextTimeline$ = createEffect(() =>
        this.actions$.pipe(
        ofType(selectOrAddNextTimeline),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState), this.store.select(selectAppState)),
        switchMap(([, currentState, appState]) =>
            from(this.bitsOfMyLifeService.selectOrAddNextTimeline(currentState)).pipe(
            map((selectedOrCreatedTimeline) => timelineSelectedOrAdded(selectedOrCreatedTimeline)),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        ...appState,
                        error
                    },
                }));
            })))
        )
    );

    selectOrAddPrevTimeline$ = createEffect(() =>
        this.actions$.pipe(
        ofType(selectOrAddPrevTimeline),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState), this.store.select(selectAppState)),
        switchMap(([, currentState, appState]) =>
            from(this.bitsOfMyLifeService.selectOrAddPrevTimeline(currentState)).pipe(
            map((selectedTimeline) => timelineSelectedOrAdded(selectedTimeline)),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        ...appState,
                        error
                    },
                }));
            })))
        )
    );

    selecTimelineById$ = createEffect(() =>
        this.actions$.pipe(
        ofType(selectTimelineById),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState), this.store.select(selectAppState)),
        switchMap(([{ timelineId }, currentState, appState]) =>
            from(this.bitsOfMyLifeService.selectTimelineById(currentState, timelineId)).pipe(
            map((timelineId) => timelineSelected(timelineId)),
            catchError((error) => {
                return of(updateAppState({
                    state: {
                        ...appState,
                        error
                    },
                }));
            })))
        )
    );

    deleteTimelineById$ = createEffect(() =>
        this.actions$.pipe(
        ofType(deleteTimelineById),
        withLatestFrom(this.store.select(selectBitsOfMyLifeState), this.store.select(selectAppState)),
        switchMap(([{ timelineId }, currentState, appState]) =>
            from(this.bitsOfMyLifeService.deleteTimelineById(currentState, timelineId)).pipe(
            map((timelineIdToRemove) => timelineDeleted({ timelineIdToRemove })),
            catchError((error) => {
                console.error('Errore durante la cancellazione di un Timeline:', error);
                return of(updateAppState({
                    state: {
                        ...appState,
                        error
                    },
                }));
            })))
        )
    );
}


