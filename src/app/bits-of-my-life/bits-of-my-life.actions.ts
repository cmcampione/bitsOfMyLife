import { createAction, props } from '@ngrx/store';
import { BitOfMyLifeToAdd } from './bits-of-my-life.models';
import { BitsOfMyLifeState } from './bits-of-my-life.state';

export const addBitOfMyLife = createAction('[BitOfMyLife] Add BitOfMyLife', props<{ bitOfMyLife: BitOfMyLifeToAdd }>());
export const bitOfMyLifeAdded = createAction('[BitOfMyLife] Add BitOfMyLife Success', props<{ state: BitsOfMyLifeState }>());

export const loadState = createAction('[BitsOfMyLife] Load State');
export const stateLoaded = createAction('[BitsOfMyLife] State Loaded', props<{ state: BitsOfMyLifeState }>());

export const saveState = createAction('[BitsOfMyLife] Save State');
export const stateSaved = createAction('[BitsOfMyLife] State Loaded',  props<{ state: BitsOfMyLifeState }>());

export const clearState = createAction('[BitsOfMyLife] Clear State');
