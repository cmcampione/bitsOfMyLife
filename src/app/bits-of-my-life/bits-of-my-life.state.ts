import { MileStonesMngr, TimelinesMngr } from './bits-of-my-life.models';

export type BitsOfMyLifeState = {
    mileStonesMngr: MileStonesMngr;
    timelinesMngr: TimelinesMngr;
    
    selectedMileStonesId: number;
    selectedTimelineId: number;
}