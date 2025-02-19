import { createReducer, on } from "@ngrx/store";
import { Milestones, Timeline } from "./bits-of-my-life.models";
import { BitsOfMyLifeState } from "./bits-of-my-life.state";
import * as BitsOfMyLifeActions from './bits-of-my-life.actions';

//////////////////////////////////////////////////////////////////////////////////////////////

export const defaultMilestonesId = 1;
export const defaultMilestonesName = 'Default';

export const defaultTimelineId = 1;
export const defaultTimelineName = 'Up to today, it has passed or still remains';//TODO: Localize

let defaultMilestones: Milestones = {
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

let defaultTimeline: Timeline = {
    name: defaultTimelineName,
    mainDate: new Date
}

let dummyTimeline: Timeline = {
    name: "Sono passati o passeranno", //TODO: Localize
    mainDate: new Date("1962-08-19")
}

export const initialBitsOfMyLifeState: BitsOfMyLifeState = {
    version: 1,

    // Why: I can't do "milestonesMngr: new MilestonesMngr([[defaultMilestonesId, new Array<Milestone>]])" ?
    milestonesMngr: new Map([
        [defaultMilestonesId, defaultMilestones]
    ]),

    // Why: I can't do "timelinesMngr: new TimelinesMngr([[defaultTimelineId, new Array<Timeline>]])" ?
    timelinesMngr: new Map<number, Timeline>([
        [defaultTimelineId, defaultTimeline],
        [100, dummyTimeline],
    ]),
    
    selectedMilestonesId: defaultMilestonesId,
    selectedTimelineId: defaultTimelineId
    //selectedTimelineId: 100
}

export const bitsOfMyLifeReducer = createReducer(
    initialBitsOfMyLifeState,    
    
    on(BitsOfMyLifeActions.milestoneAdded, (state, { newMilestone }) => {
        
        // Get the selected milestones
        const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
        if (!selectedMilestones) {
            throw new Error('Selected Milestones not found. Unable to add the milestone.');
        }

        // Update the selected milestones with the new Milestone
        const updatedMilestones: Milestones = {
            ...selectedMilestones,
            milestones: [...selectedMilestones.milestones, newMilestone],
        };

        // Create a new updated manager
        const updatedMilestonesMngr = new Map(state.milestonesMngr).set(
            state.selectedMilestonesId,
            updatedMilestones
        );

        // Update the state
        return {
            ...state,
            milestonesMngr: updatedMilestonesMngr,
        };
    }),
    on(BitsOfMyLifeActions.milestoneDeleted,(state, { milestoneIdToRemove }) => {  
       // Find the selected milestones
      const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
      if (!selectedMilestones) {
        throw new Error('Selected Milestones not found. Unable to remove the milestone.');
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
      const updatedMilestonesMngr = new Map(state.milestonesMngr).set(
        state.selectedMilestonesId,
        updatedMilestones
      );

      // Update the state
      return {
        ...state,
        milestonesMngr: updatedMilestonesMngr,
      };
    }),
    on(BitsOfMyLifeActions.milestoneEdited, (state, { updatedMilestone }) => {
        // Get the selected milestones
        const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
        if (!selectedMilestones) {
            throw new Error('Selected Milestones not found. Unable to edit the milestone.');
        }
        
        // Find the milestone to edit
        const milestoneIndex = selectedMilestones.milestones.findIndex((milestone) => milestone.id === updatedMilestone.id);
        if (milestoneIndex === -1) {
            throw new Error('Milestone not found. Unable to edit the milestone.');
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
        const updatedMilestonesMngr = new Map(state.milestonesMngr).set(
            state.selectedMilestonesId,
            updatedMilestones
        );
        
        // Update the state
        return {
            ...state,
            milestonesMngr: updatedMilestonesMngr,
        };
    }),
    on(BitsOfMyLifeActions.stateLoaded, (state, { state: loadedState }) => ({ ...loadedState })),
    // ToDo: To remove
    on(BitsOfMyLifeActions.clearState, () => ({ ...initialBitsOfMyLifeState }))
);
