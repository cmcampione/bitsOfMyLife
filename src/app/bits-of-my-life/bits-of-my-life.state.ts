import { BitOfMyLife, MilestonesMngr, TimelinesMngr } from './bits-of-my-life.models';

export type BitsOfMyLifeState = {
    version: number;
    milestonesMngr: MilestonesMngr;
    timelinesMngr: TimelinesMngr;
    
    // SelectedMilestonesId: string;
    selectedMilestonesIndex: number;

    selectedTimelineId: string;
    selectedTimelineIndex: number;
}

export type SelectedBitsOfMyLifeState = {
    // milestonesId: string;
    milestonesIndex: number;
    milestonesName: string;

    timelineId: string;
    timelineIndex: number
    timelineName: string;
    timelineMainDate: Date;
    
    timelinesLenght: number;
    
    bitsOfMyLife: ReadonlyArray<BitOfMyLife>
}
