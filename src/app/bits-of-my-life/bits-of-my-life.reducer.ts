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
        id: 1,
        note: 'I was born',
        date: new Date("1962-08-19")
    },
    {   id: 2,
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
    milestoneIdCounter: 2,

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
    
    on(BitsOfMyLifeActions.milestoneAdded, (state, { milestoneToAdd }) => {
        const newIdMilestone = state.milestoneIdCounter + 1;

        // Creazione del nuovo Milestone
        const newMilestone: Milestone = {
            id: newIdMilestone,
            date: milestoneToAdd.date,
            note: milestoneToAdd.note,
        };

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
        const updatedState: BitsOfMyLifeState = {
            ...state,
            milestoneIdCounter: newIdMilestone,
            milestonesMngr: updatedMilestonesMngr,
        };

        // Restituisce lo stato aggiornato
        return updatedState;
    }),
    on(BitsOfMyLifeActions.milestoneDeleted, (state, { state: updatedState }) => ({ ...updatedState })),
    on(BitsOfMyLifeActions.milestoneEdited, (state, { state: updatedState }) => ({ ...updatedState })),
    on(BitsOfMyLifeActions.stateLoaded, (state, { state: loadedState }) => ({ ...loadedState })),

    on(BitsOfMyLifeActions.clearState, () => ({ ...initialBitsOfMyLifeState }))
);
