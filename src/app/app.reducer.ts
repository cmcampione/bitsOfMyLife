import { createReducer, on } from "@ngrx/store";
import { MileStone, MileStones, MileStonesMngr,  Timeline } from "./app.models";
import { AppState } from "./app.state";

export const defaultMileStonesId = 1;
export const defaultMileStonesName = 'Default';

export const defaultTimelineId = 1;
export const defaultTimelineName = 'Default';

let defaultMileStones: MileStones = {
    name: defaultMileStonesName,
    mileStones: [{
        note: 'Default',// Info: It is Ok
        date: new Date
    }]
}

let defaultTimeline: Timeline = {
    name: defaultTimelineName,
    mainDate: new Date
}

export const initialAppState: AppState = {

    // Why: I can't do "mileStonesMngr: MileStonesMngr([['default', new Array<MileStone>]])" ?
    mileStonesMngr: new Map<number, MileStones>([
        [defaultMileStonesId, defaultMileStones]
    ]),

    timelinesMngr: new Map<number, Timeline>([
        [defaultTimelineId, defaultTimeline]
    ]),
    
    selectedMileStones: defaultMileStonesId,
    selectedTimeline: defaultTimelineId
}

export const appReducer = createReducer(
    initialAppState,
);
