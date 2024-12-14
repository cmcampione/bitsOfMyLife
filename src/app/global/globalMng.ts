import { on, createAction, createFeatureSelector, createReducer, props } from '@ngrx/store';

// Models
export type Error = {
    code: number;
    description: string
}

// State
export type AppState = {
    error: Error;
    //isLoggedIn: boolean
}

// Selectors
export const selectAppState = createFeatureSelector<AppState>('AppState');

// Reducers
export const initialAppState : AppState = {
    error: {
        code: 0,
        description: "No error"
    }
}

// Actions
export const updateAppState = createAction('[AppState] Update ', props<{ state: AppState}>());

// Reducers
export const appReducer = createReducer(
    initialAppState,
    on(updateAppState, (state, { state: newState }) => ({ ...state, ...newState })),    
)
