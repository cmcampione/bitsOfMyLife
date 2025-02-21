import { BitOfMyLife, MilestonesMngr, TimelinesMngr } from './bits-of-my-life.models';

export type BitsOfMyLifeState = {
    version: number;
    milestonesMngr: MilestonesMngr;
    timelinesMngr: TimelinesMngr;
    
    selectedMilestonesIndex: number;
    selectedTimelineIndex: number;
}

export type SelectedBitsOfMyLifeState = {
    milestonesIndex: number;
    milestonesName: string;
    timelineIndex: number
    timelineName: string;
    timelineMainDate: Date;
    timelinesLenght: number;
    bitsOfMyLife: ReadonlyArray<BitOfMyLife>
}
