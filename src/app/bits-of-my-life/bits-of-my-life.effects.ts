import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, tap } from "rxjs";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { BitsOfMyLifeService } from "./bits-of-my-life.service";
import { loadState, stateLoaded, saveState, clearState } from "./bits-of-my-life.actions";

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
                tap(({ state }) => {
                    this.bitsOfMyLifeService.saveState(state);
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
