import { createReducer, on } from "@ngrx/store";
import { Milestone, Milestones, MilestoneToAdd, Timeline } from "./bits-of-my-life.models";
import { BitsOfMyLifeState } from "./bits-of-my-life.state";
import * as BitsOfMyLifeActions from './bits-of-my-life.actions';

//////////////////////////////////////////////////////////////////////////////////////////////

export const defaultMilestonesId = 1;
export const defaultMilestonesName = 'Default';

export const defaultTimelineId = 1;
export const defaultTimelineName = 'Ad oggi sono passati o mancano ancora';

let defaultMilestones: Milestones = {
    name: defaultMilestonesName,
    milestones: [{
        id: "bf156a93-b6a6-464d-9c02-40663103a180",
        note: 'I was born',
        date: new Date("1962-08-19")
    },
    {   id: "e8519e32-8a0d-4b92-8ed7-4a620bbc3b60",
        note: 'I married',
        date: new Date("1988-07-27")
    }]
}

let defaultTimeline: Timeline = {
    name: defaultTimelineName,
    mainDate: new Date
}

export const initialBitsOfMyLifeState: BitsOfMyLifeState = {
    version: 1,

    // Why: I can't do "milestonesMngr: new MilestonesMngr([[defaultMilestonesId, new Array<Milestone>]])" ?
    milestonesMngr: new Map([
        [defaultMilestonesId, defaultMilestones]
    ]),

    // Why: I can't do "timelinesMngr: new TimelinesMngr([[defaultTimelineId, new Array<Timeline>]])" ?
    timelinesMngr: new Map<number, Timeline>([
        [defaultTimelineId, defaultTimeline]
    ]),
    
    selectedMilestonesId: defaultMilestonesId,
    selectedTimelineId: defaultTimelineId
}

export const bitsOfMyLifeReducer = createReducer(
    initialBitsOfMyLifeState,    
    
    on(BitsOfMyLifeActions.milestoneAdded, (state, { newMilestone }) => {
        
        // Ottieni i traguardi selezionati
        const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
        if (!selectedMilestones) {
            throw new Error('Selected Milestones not found. Unable to add the milestone.');
        }

        // Aggiorna i traguardi selezionati con il nuovo Milestone
        const updatedMilestones: Milestones = {
            ...selectedMilestones,
            milestones: [...selectedMilestones.milestones, newMilestone],
        };

        // Crea un nuovo manager aggiornato
        const updatedMilestonesMngr = new Map(state.milestonesMngr).set(
            state.selectedMilestonesId,
            updatedMilestones
        );

        // Aggiorna lo stato
        return {
            ...state,
            milestonesMngr: updatedMilestonesMngr,
        };
    }),
    on(BitsOfMyLifeActions.milestoneDeleted,(state, { milestoneIdToRemove }) => {  
       // Trova i traguardi selezionati
      const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
      if (!selectedMilestones) {
        throw new Error('Selected Milestones not found. Unable to remove the milestone.');
      }

      // Filtra per rimuovere la milestone con l'ID specificato
      const filteredMilestones = selectedMilestones.milestones.filter(
        (milestone) => milestone.id !== milestoneIdToRemove
      );

      // Aggiorna i traguardi selezionati
      const updatedMilestones: Milestones = {
        ...selectedMilestones,
        milestones: filteredMilestones,
      };

      // Crea un nuovo manager aggiornato
      const updatedMilestonesMngr = new Map(state.milestonesMngr).set(
        state.selectedMilestonesId,
        updatedMilestones
      );

      // Aggiorna lo stato
      return {
        ...state,
        milestonesMngr: updatedMilestonesMngr,
      };
    }),
    on(BitsOfMyLifeActions.milestoneEdited, (state, { state: updatedState }) => ({ ...updatedState })),
    on(BitsOfMyLifeActions.stateLoaded, (state, { state: loadedState }) => ({ ...loadedState })),
    // ToDo: To remove
    on(BitsOfMyLifeActions.clearState, () => ({ ...initialBitsOfMyLifeState }))
);
