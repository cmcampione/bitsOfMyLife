import { createAction, props } from '@ngrx/store';
import { Milestone, MilestoneToAdd, MilestoneToEdit, Timeline } from './bits-of-my-life.models';
import { BitsOfMyLifeState } from './bits-of-my-life.state';

// Load/Save/Clear State Actions

export const loadState = createAction('[BitsOfMyLife] Load State');
export const stateLoaded = createAction('[BitsOfMyLife] State Loaded', props<{ state: BitsOfMyLifeState }>());

// Milestone Actions

export const addMilestone = createAction('[BitOfMyLife] Add Milestone', props<{ milestoneToAdd: MilestoneToAdd }>());
export const milestoneAdded = createAction('[BitOfMyLife] Add Milestone Success', props<{ newMilestone: Milestone }>());

export const editMilestone = createAction('[BitsOfMyLife] Edit Milestone', props<{ milestoneToEdit: MilestoneToEdit }>());
export const milestoneEdited = createAction('[BitsOfMyLife] Edit Milestone Success', props<{ updatedMilestone: Milestone }>());

export const deleteMilestone = createAction("[BitOfMyLife] Delete Milestone", props<{ milestoneIdToRemove: string }>());
export const milestoneDeleted = createAction('[BitOfMyLife] Delete Milestone Success', props<{ milestoneIdToRemove: string }>());

// Timeline Actions

export const deleteSelectedTimeline = createAction("[BitOfMyLife] Delete Selected Timeline");
export const selectedTimelineDeleted = createAction('[BitsOfMyLife] Delete Selected Timeline Success', props<{ timelineIdToRemove: string }>());

export const selectOrAddNextTimeline = createAction('[BitsOfMyLife] Select or Add Next Timeline');
export const selectOrAddPrevTimeline = createAction('[BitsOfMyLife] Select or Add Prev Timeline');
export const timelineSelectedOrAdded = createAction('[BitsOfMyLife] Selected or Added Timeline', props<{ isSelected: boolean; timelineIndex: number; timeline: Timeline}>());

export const selectTimelineById = createAction('[BitsOfMyLife] Select Timeline by Id', props<{ timelineId: string}>());
export const timelineSelected = createAction('[BitsOfMyLife] Timeline Selected', props<{ timelineId: string }>());

export const addTimeline = createAction('[BitsOfMyLife] Add Timeline', props<{ timelineToAdd: Timeline }>());
export const timelineAdded = createAction('[BitsOfMyLife] Add Timeline Success', props<{ newTimeline: Timeline }>());

export const updateTimeline = createAction('[BitsOfMyLife] Edit Selected Timeline', props<{ timelineToEdit: Timeline }>());
export const timelineUpdated = createAction('[BitsOfMyLife] Edit Selected Timeline Success', props<{ updatedTimeline: Timeline }>());

export const deleteTimelineById = createAction("[BitOfMyLife] Delete Timeline by Id", props<{ timelineId: string }>());
export const timelineDeleted = createAction('[BitsOfMyLife] Timeline Deleted by Id ', props<{ timelineIdToRemove: string }>());

// 

// Todo: To check, don't know if useful
export const saveState = createAction('[BitsOfMyLife] Save State');
// Todo: To check, don't know if useful
export const stateSaved = createAction('[BitsOfMyLife] State Loaded',  props<{ state: BitsOfMyLifeState }>());

// Todo: To check, don't know if useful
export const clearState = createAction('[BitsOfMyLife] Clear State');




