import { createReducer, on } from "@ngrx/store";
import { Milestone, Milestones, MilestonesMngr, Timeline } from "./bits-of-my-life.models";
import { BitsOfMyLifeState } from "./bits-of-my-life.state";
import * as BitsOfMyLifeActions from './bits-of-my-life.actions';

//////////////////////////////////////////////////////////////////////////////////////////////

export const defaultMileStonesId = 1;
export const defaultMileStonesName = 'Default';

export const defaultTimelineId = 1;
export const defaultTimelineName = 'Default';

let defaultMileStones: Milestones = {
    name: defaultMileStonesName,
    mileStones: [{
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

    milestoneIdCounter: 2,

    // Why: I can't do "mileStonesMngr: new MileStonesMngr([[defaultMileStonesId, new Array<MileStone>]])" ?
    mileStonesMngr: new Map([
        [defaultMileStonesId, defaultMileStones]
    ]),

    // Why: I can't do "timelinesMngr: new TimelinesMngr([[defaultTimelineId, new Array<Timeline>]])" ?
    timelinesMngr: new Map<number, Timeline>([
        [defaultTimelineId, defaultTimeline]
    ]),
    
    selectedMileStonesId: defaultMileStonesId,
    selectedTimelineId: defaultTimelineId
}

export const bitsOfMyLifeReducer = createReducer(
    initialBitsOfMyLifeState,    
    
    on(BitsOfMyLifeActions.bitOfMyLifeAdded, (state, { state: updatedState }) => ({ ...updatedState })), // Non modifica nulla, ma intercetta l'azione
    
    on(BitsOfMyLifeActions.stateLoaded, (state, { state: loadedState }) => ({ ...loadedState })),

    on(BitsOfMyLifeActions.saveState, (state) => ({ ...state })), // Non modifica nulla, ma intercetta l'azione    
    on(BitsOfMyLifeActions.stateSaved, (state, { state: savedState }) => ({ ...savedState })),

    on(BitsOfMyLifeActions.clearState, () => ({ ...initialBitsOfMyLifeState }))
);
