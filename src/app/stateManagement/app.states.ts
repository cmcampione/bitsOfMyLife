import { MileStonesMngr, TimelinesMngr } from './app.models';

export type BitsOfMyLifeState = {
    mileStonesMngr: MileStonesMngr;
    timelinesMngr: TimelinesMngr;
    
    selectedMileStonesId: number;
    selectedTimelineId: number;
}