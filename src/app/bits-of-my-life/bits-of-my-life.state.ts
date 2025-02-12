import { BitOfMyLife, MilestonesMngr, TimelinesMngr } from './bits-of-my-life.models';

export type BitsOfMyLifeState = {
    version: number;
    milestoneIdCounter: number;
    milestonesMngr: MilestonesMngr;
    timelinesMngr: TimelinesMngr;
    
    selectedMilestonesId: number;
    selectedTimelineId: number;
}

export type SelectedBitsOfMyLifeState = {
    milestonesName: string;
    timelineName: string;
    timelineMainDate: Date;
    bitsOfMyLife: ReadonlyArray<BitOfMyLife>
}
