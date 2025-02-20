import { createAction, props } from '@ngrx/store';
import { Milestone, MilestoneToAdd, MilestoneToEdit, Timeline } from './bits-of-my-life.models';
import { BitsOfMyLifeState } from './bits-of-my-life.state';

export const loadState = createAction('[BitsOfMyLife] Load State');
export const stateLoaded = createAction('[BitsOfMyLife] State Loaded', props<{ state: BitsOfMyLifeState }>());

export const addMilestone = createAction('[BitOfMyLife] Add Milestone', props<{ milestoneToAdd: MilestoneToAdd }>());
export const milestoneAdded = createAction('[BitOfMyLife] Add Milestone Success', props<{ newMilestone: Milestone }>());

export const editMilestone = createAction('[BitsOfMyLife] Edit Milestone', props<{ milestoneToEdit: MilestoneToEdit }>());
export const milestoneEdited = createAction('[BitsOfMyLife] Edit Milestone Success', props<{ updatedMilestone: Milestone }>());

export const deleteMilestone = createAction("[BitOfMyLife] Delete Milestone", props<{ id: string }>());
export const milestoneDeleted = createAction('[BitOfMyLife] Delete Milestone Success', props<{ milestoneIdToRemove: string }>());

export const selectOrAddNextTimeline = createAction('[BitsOfMyLife] Select or Add Next Timeline');
export const selectOrAddPrevTimeline = createAction('[BitsOfMyLife] Select or Add Prev Timeline');
export const timelineSelectedOrAdded = createAction('[BitsOfMyLife] Selected or Added Timeline', props<{ isSelected: boolean; timelineIndex: number; timeline: Timeline}>());

// Todo: To check, don't know if useful
export const saveState = createAction('[BitsOfMyLife] Save State');
// Todo: To check, don't know if useful
export const stateSaved = createAction('[BitsOfMyLife] State Loaded',  props<{ state: BitsOfMyLifeState }>());

// Todo: To check, don't know if useful
export const clearState = createAction('[BitsOfMyLife] Clear State');




