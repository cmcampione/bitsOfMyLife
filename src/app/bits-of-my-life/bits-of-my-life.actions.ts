import { createAction, props } from '@ngrx/store';
import { Milestone, MilestoneToAdd, MilestoneToEdit } from './bits-of-my-life.models';
import { BitsOfMyLifeState } from './bits-of-my-life.state';

export const addMilestone = createAction('[BitOfMyLife] Add Milestone', props<{ milestoneToAdd: MilestoneToAdd }>());
export const milestoneAdded = createAction('[BitOfMyLife] Add Milestone Success', props<{ newMilestone: Milestone }>());

export const editMilestone = createAction('[BitsOfMyLife] Edit Milestone', props<{ milestoneToEdit: MilestoneToEdit }>());
export const milestoneEdited = createAction('[BitsOfMyLife] Edit Milestone Success', props<{ state: BitsOfMyLifeState }>());

export const deleteMilestone = createAction("[BitOfMyLife] Delete Milestone", props<{ id: string }>());
export const milestoneDeleted = createAction('[BitOfMyLife] Delete Milestone Success', props<{ state: BitsOfMyLifeState }>());

export const loadState = createAction('[BitsOfMyLife] Load State');
export const stateLoaded = createAction('[BitsOfMyLife] State Loaded', props<{ state: BitsOfMyLifeState }>());

export const saveState = createAction('[BitsOfMyLife] Save State');
export const stateSaved = createAction('[BitsOfMyLife] State Loaded',  props<{ state: BitsOfMyLifeState }>());

export const clearState = createAction('[BitsOfMyLife] Clear State');
