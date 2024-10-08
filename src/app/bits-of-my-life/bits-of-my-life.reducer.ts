import { createReducer, on } from "@ngrx/store";
import { MileStone, MileStones, MileStonesMngr, Timeline } from "./bits-of-my-life.models";
import { BitsOfMyLifeState } from "./bits-of-my-life.state";
import * as BitsOfMyLifeActions from './bits-of-my-life.actions';

// Temporarily
export const initialAppState = {
    dummy: 'dummy'
}

export const appReducer = createReducer(
    initialAppState,
)

export const defaultMileStonesId = 1;
export const defaultMileStonesName = 'Default';

export const defaultTimelineId = 1;
export const defaultTimelineName = 'Default';

let defaultMileStones: MileStones = {
    name: defaultMileStonesName,
    mileStones: [{
        note: 'I was born',
        date: new Date("1962-08-19")
    },
    {        
        note: 'I married',
        date: new Date("1988-07-27")
    }]
}

let defaultTimeline: Timeline = {
    name: defaultTimelineName,
    mainDate: new Date
}

export const initialBitsOfMyLifeState: BitsOfMyLifeState = {

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
    on(BitsOfMyLifeActions.addBitOfMyLife, (state, { bitOfMyLife }) => {
        let mileStone: MileStone = {
            date: bitOfMyLife.date,
            note: bitOfMyLife.note
        }
        let mileStonesMngr: MileStonesMngr = state.mileStonesMngr;
        let selectMileStones: MileStones | undefined = mileStonesMngr.get(state.selectedMileStonesId);
        if (selectMileStones) {
            //selectMileStones.mileStones = [...selectMileStones.mileStones, mileStone].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            selectMileStones.mileStones = [...selectMileStones.mileStones, mileStone];
        } else {
            //ToDo: To manage error
        }
        return {
            ...state
        };
    })
);