import { createAction, props } from '@ngrx/store';
import { BitOfMyLifeToAdd, BitOfMyLifeToEdit } from './bits-of-my-life.models';
import { BitsOfMyLifeState } from './bits-of-my-life.state';

export const addBitOfMyLife = createAction('[BitOfMyLife] Add BitOfMyLife', props<{ bitOfMyLifeToAdd: BitOfMyLifeToAdd }>());
export const bitOfMyLifeAdded = createAction('[BitOfMyLife] Add BitOfMyLife Success', props<{ state: BitsOfMyLifeState }>());

export const editBitOfMyLife = createAction('[BitsOfMyLife] Edit BitOfMyLife', props<{ bitOfMyLifeToEdit: BitOfMyLifeToEdit }>());
export const bitOfMyLifeEdited = createAction('[BitsOfMyLife] Edit Bit Of My Life Success', props<{ state: BitsOfMyLifeState }>());

export const deleteBitOfMyLife = createAction("[BitOfMyLife] Delete BitOfMyLife", props<{ id: number }>());
export const bitOfMyLifeDeleted = createAction('[BitOfMyLife] Delete BitOfMyLife Success', props<{ state: BitsOfMyLifeState }>());

export const loadState = createAction('[BitsOfMyLife] Load State');
export const stateLoaded = createAction('[BitsOfMyLife] State Loaded', props<{ state: BitsOfMyLifeState }>());

export const saveState = createAction('[BitsOfMyLife] Save State');
export const stateSaved = createAction('[BitsOfMyLife] State Loaded',  props<{ state: BitsOfMyLifeState }>());

export const clearState = createAction('[BitsOfMyLife] Clear State');
