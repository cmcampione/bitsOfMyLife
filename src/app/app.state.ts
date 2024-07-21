import { MileStonesMngr, TimelinesMngr } from './app.models';

export type AppState = {    
    mileStonesMngr: MileStonesMngr;
    timelinesMngr: TimelinesMngr;
    
    selectedMileStonesId: number;
    selectedTimelineId: number;
}