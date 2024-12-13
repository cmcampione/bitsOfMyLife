import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, tap, withLatestFrom } from "rxjs";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { BitsOfMyLifeService } from "./bits-of-my-life.service";
import { loadState, stateLoaded, saveState, clearState } from "./bits-of-my-life.actions";
import { selectBitsOfMyLife, selectBitsOfMyLifeState } from "./bits-of-my-life.selectors";

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
            map(() => {
                const state = this.bitsOfMyLifeService.loadState();
                return stateLoaded({ state });
            })
        )
    );

    saveState$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(saveState),
                withLatestFrom(this.store.select(selectBitsOfMyLifeState)),
                tap(([action, currentState]) => {
                    this.bitsOfMyLifeService.saveState(currentState);
                })
            ),
        { dispatch: false }
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
