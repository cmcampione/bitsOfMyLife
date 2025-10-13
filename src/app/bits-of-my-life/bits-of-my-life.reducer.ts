import { createReducer, on } from "@ngrx/store";
import { Milestones, Timeline } from "./bits-of-my-life.models";
import { BitsOfMyLifeState } from "./bits-of-my-life.state";
import * as BitsOfMyLifeActions from './bits-of-my-life.actions';

//////////////////////////////////////////////////////////////////////////////////////////////

export const defaultMilestonesIndex = 0;
export const defaultMilestonesName = 'Default';

export const defaultTimelineId = "9f747525-b203-4e22-b200-a20f0dd37ed1";
export const defaultTimelineIndex = 0;
export const defaultTimelineName = 'Up to today, it has passed or still remains';//TODO: Localize

const defaultMilestones: Milestones = {
    name: defaultMilestonesName,
    milestones: [{
        id: "bf156a93-b6a6-464d-9c02-40663103a180",
        note: 'I was born',//TODO: Localize
        date: new Date("1962-08-19")
    },
    {   id: "e8519e32-8a0d-4b92-8ed7-4a620bbc3b60",
        note: 'I married',//TODO: Localize
        date: new Date("1988-07-27")
    }]
}

const defaultTimeline: Timeline = {
    id: defaultTimelineId,
    name: defaultTimelineName,
    mainDate: new Date
}

const dummyTimeline: Timeline = {
    id: "7d11b7e7-e49c-4135-93c2-798d38b4f05d",
    name: "Sono passati o passeranno", //TODO: Localize
    mainDate: new Date("1962-08-19")
}

const dummyTimeline1: Timeline = {
    id: "7d11b7e7-e49c-4135-93c2-798d38b4f051",
    name: "Sono passati o passeranno", //TODO: Localize
    mainDate: new Date("1962-08-19")
}

export const initialBitsOfMyLifeState: BitsOfMyLifeState = {
    version: 1,
    
    milestonesMngr: [defaultMilestones],
    timelinesMngr: [defaultTimeline, dummyTimeline, dummyTimeline1],
    
    selectedMilestonesIndex: defaultMilestonesIndex,
    
    selectedTimelineId: defaultTimelineId,
    selectedTimelineIndex: defaultTimelineIndex
}

export const bitsOfMyLifeReducer = createReducer(
    initialBitsOfMyLifeState,    
    
    on(BitsOfMyLifeActions.stateLoaded, (state, { state: loadedState }) => ({ ...loadedState })),

    on(BitsOfMyLifeActions.milestoneAdded, (state, { newMilestone }) => {
        
        // Get the selected milestones
        const selectedMilestones = state.milestonesMngr[state.selectedMilestonesIndex];
        if (!selectedMilestones) {
            console.error('No selected milestones found. Unable to add the milestone. Code: 9');
            return state; // Any potential error is handled by the effects
        }

        // Update the selected milestones with the new Milestone
        const updatedMilestones: Milestones = {
            ...selectedMilestones,
            milestones: [...selectedMilestones.milestones, newMilestone],
        };

        // Create a new updated manager
        const updatedMilestonesMngr = state.milestonesMngr.map((milestones, index) =>
            index === state.selectedMilestonesIndex ? updatedMilestones : milestones
        );
          
        // Update the state
        return {
            ...state,
            milestonesMngr: updatedMilestonesMngr,
        };
    }),    
    on(BitsOfMyLifeActions.milestoneEdited, (state, { updatedMilestone }) => {
        // Get the selected milestones
        const selectedMilestones = state.milestonesMngr[state.selectedMilestonesIndex];
        if (!selectedMilestones) {
            console.error('No selected milestones found. Unable to edit the milestone. Code: 10');
            return state; // Reducer must be pure
        }
        
        // Find the milestone to edit
        const milestoneIndex = selectedMilestones.milestones.findIndex((milestone) => milestone.id === updatedMilestone.id);
        if (milestoneIndex === -1) {
            console.error('Milestone not found. Unable to edit the milestone. Code: 11');
            return state; // Reducer must be pure
        }
            
        // Update the list of milestones
        const updatedMilestones: Milestones = {
            ...selectedMilestones,
            milestones: [
                ...selectedMilestones.milestones.slice(0, milestoneIndex),
                updatedMilestone,
                ...selectedMilestones.milestones.slice(milestoneIndex + 1),
            ],
        };
        
        // Create a new updated manager
        const updatedMilestonesMngr = state.milestonesMngr.map((milestone, index) => 
            index === state.selectedMilestonesIndex ? updatedMilestones : milestone
        );
        
        // Update the state
        return {
            ...state,
            milestonesMngr: updatedMilestonesMngr,
        };
    }),    
    on(BitsOfMyLifeActions.milestoneDeleted,(state, { milestoneIdToRemove }) => {  
        // Find the selected milestones
       const selectedMilestones = state.milestonesMngr[state.selectedMilestonesIndex];
       if (!selectedMilestones) {
            console.error('No selected milestones found. Unable to delete the milestone. Code: 12');
            return state; // Reducer must be pure
       }
 
       // Filter to remove the milestone with the specified ID
       const filteredMilestones = selectedMilestones.milestones.filter(
         (milestone) => milestone.id !== milestoneIdToRemove
       );
 
       // Update the selected milestones
       const updatedMilestones: Milestones = {
         ...selectedMilestones,
         milestones: filteredMilestones,
       };
 
       // Create a new updated manager
       const updatedMilestonesMngr = state.milestonesMngr.map((milestone, index) => 
         index === state.selectedMilestonesIndex ? updatedMilestones : milestone
       );
       // Update the state
       return {
         ...state,
         milestonesMngr: updatedMilestonesMngr,
       };
    }),

    on(BitsOfMyLifeActions.selectedTimelineEdited, (state, { updatedTimeline }) => {

        const updatedTimelinesMngr = state.timelinesMngr.map((timeline) =>
            timeline.id === state.selectedTimelineId ? updatedTimeline : timeline
        );
        const updatedState: BitsOfMyLifeState = {
            ...state,
            timelinesMngr: updatedTimelinesMngr,
        };
        
        return updatedState;
    }),
    on(BitsOfMyLifeActions.selectedTimelineDeleted, (state, { timelineIdToRemove: timelineIdToRemove }) => {
        const updatedTimelinesMngr = state.timelinesMngr.filter((timeline) => timeline.id !== timelineIdToRemove);
        const updatedState: BitsOfMyLifeState = {
            ...state,
            timelinesMngr: updatedTimelinesMngr,
            selectedTimelineId: defaultTimelineId,
            selectedTimelineIndex: updatedTimelinesMngr.findIndex((timeline) => timeline.id === defaultTimelineId)
        };
        return updatedState;
    }),
    on(BitsOfMyLifeActions.timelineSelectedOrAdded, (state, { isSelected, timelineIndex, timeline }) => { 
        
        if (isSelected)
            return { 
            ...state, 
            selectedTimelineId: timeline.id,
            selectedTimelineIndex: timelineIndex 
        }
        
        const updatedTimelinesMngr = [...state.timelinesMngr.slice(0,timelineIndex), timeline, ...state.timelinesMngr.slice(timelineIndex)];        
        return {
            ...state,
            timelinesMngr: updatedTimelinesMngr, 
            selectedTimelineId: timeline.id,
            selectedTimelineIndex: timelineIndex
        };
    }),
    on(BitsOfMyLifeActions.timelineSelected, (state, { timelineId }) => { 
        const timelineIndex = state.timelinesMngr.findIndex(t => t.id === timelineId);
        
        if (timelineIndex === -1) {
            console.error('No selected timeline found. Unable to select the timeline. Code: 14');
            return state; // Reducer deve essere puro
        }

        return { 
            ...state, 
            selectedTimelineId: timelineId,
            selectedTimelineIndex: timelineIndex
        };
    }),
    on(BitsOfMyLifeActions.timelineDeleted, (state, { timelineIdToRemove }) => {
        const updatedTimelinesMngr = state.timelinesMngr.filter((timeline) => timeline.id !== timelineIdToRemove);
        const updatedState: BitsOfMyLifeState = {
            ...state,
            timelinesMngr: updatedTimelinesMngr,
            selectedTimelineId: defaultTimelineId,
            selectedTimelineIndex: updatedTimelinesMngr.findIndex((timeline) => timeline.id === defaultTimelineId)
        };
        return updatedState;
    }),

    // ToDo: To remove?
    on(BitsOfMyLifeActions.clearState, () => ({ ...initialBitsOfMyLifeState }))
);
