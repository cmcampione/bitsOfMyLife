import { createAction, props } from '@ngrx/store';
import { BitOfMyLifeToAdd } from './bits-of-my-life.models';
import { BitsOfMyLifeState } from './bits-of-my-life.state';
/*
export const loadEvents = createAction('[Event] Load Events');
export const loadEventsSuccess = createAction('[Event] Load Events Success', props<{ events: Event[] }>());
export const loadEventsFailure = createAction('[Event] Load Events Failure', props<{ error: any }>());
*/

export const addBitOfMyLife = createAction('[BitOfMyLife] Add BitOfMyLife', props<{ bitOfMyLife: BitOfMyLifeToAdd }>());
/*
export const addBitOfMyLifeSuccess = createAction('[BitOfMyLife] Add BitOfMyLife Success', props<{ bitOfMyLife: BitOfMyLifeToAdd }>());
export const addBitOfMyLifeFailure = createAction('[BitOfMyLife] Add BitOfMyLife Failure', props<{ error: any }>());
*/
/*
export const updateEvent = createAction('[Event] Update Event', props<{ event: Event }>());
export const updateEventSuccess = createAction('[Event] Update Event Success', props<{ event: Event }>());
export const updateEventFailure = createAction('[Event] Update Event Failure', props<{ error: any }>());
*/
/*
export const deleteEvent = createAction('[Event] Delete Event', props<{ id: string }>());
export const deleteEventSuccess = createAction('[Event] Delete Event Success', props<{ id: string }>());
export const deleteEventFailure = createAction('[Event] Delete Event Failure', props<{ error: any }>());
*/

export const loadState = createAction('[BitsOfMyLife] Load State');
export const saveState = createAction('[BitsOfMyLife] Save State');
export const clearState = createAction('[BitsOfMyLife] Clear State');
export const stateLoaded = createAction('[BitsOfMyLife] State Loaded', props<{ state: BitsOfMyLifeState }>());