import { MileStonesMngr, TimelinesMngr } from './bits-of-my-life.models';

export type BitsOfMyLifeState = {
    milestoneIdCounter: number;
    mileStonesMngr: MileStonesMngr;
    timelinesMngr: TimelinesMngr;
    
    selectedMileStonesId: number;
    selectedTimelineId: number;
}