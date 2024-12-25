import { MilestonesMngr, TimelinesMngr } from './bits-of-my-life.models';

export type BitsOfMyLifeState = {
    stateVersion: number;
    milestoneIdCounter: number;
    milestonesMngr: MilestonesMngr;
    timelinesMngr: TimelinesMngr;
    
    selectedMilestonesId: number;
    selectedTimelineId: number;
}