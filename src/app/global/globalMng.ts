import { on, createAction, createFeatureSelector, createReducer, props } from '@ngrx/store';

// State
export type AppState = {
    error: Error | null;
    //isLoggedIn: boolean
}

// Selectors
export const selectAppState = createFeatureSelector<AppState>('AppState');

// Reducers
export const initialAppState : AppState = {
    error: null,
}

// Actions
export const updateAppState = createAction('[AppState] Update ', props<{ state: AppState}>());

// Reducers
export const appReducer = createReducer(
    initialAppState,
    on(updateAppState, (state, { state: newState }) => ({ ...state, ...newState })),    
)
