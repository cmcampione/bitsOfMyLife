import { MilestonesMngr, TimelinesMngr } from './bits-of-my-life.models';

export type BitsOfMyLifeState = {
    milestoneIdCounter: number;
    mileStonesMngr: MilestonesMngr;
    timelinesMngr: TimelinesMngr;
    
    selectedMileStonesId: number;
    selectedTimelineId: number;
}