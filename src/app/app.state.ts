import { MileStonesMngr, TimelinesMngr } from './app.models';

export type AppState = {    
    mileStonesMngr: MileStonesMngr;
    timelinesMngr: TimelinesMngr;
    
    selectedMileStones: number;
    selectedTimeline: number;
}