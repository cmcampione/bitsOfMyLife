import { BitOfMyLife, MilestonesMngr, TimelinesMngr } from './bits-of-my-life.models';

export type BitsOfMyLifeState = {
    version: number;
    milestonesMngr: MilestonesMngr;
    timelinesMngr: TimelinesMngr;
    
    selectedMilestonesId: number;
    selectedTimelineIndex: number;
}

export type SelectedBitsOfMyLifeState = {
    milestonesId: number;
    milestonesName: string;
    timelineIndex: number
    timelineName: string;
    timelineMainDate: Date;
    bitsOfMyLife: ReadonlyArray<BitOfMyLife>
}
