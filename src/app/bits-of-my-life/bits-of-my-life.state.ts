import { BitOfMyLife, MilestonesMngr, TimelinesMngr } from './bits-of-my-life.models';

export type BitsOfMyLifeState = {
    version: number;
    
    milestonesMngr: MilestonesMngr;
    timelinesMngr: TimelinesMngr;
    
    // SelectedMilestonesId: string; //Todo: to check, don't know if useful
    selectedMilestonesIndex: number;

    selectedTimelineId: string; //TODO: to check if useful
    selectedTimelineIndex: number;
}

export type SelectedBitsOfMyLifeState = {
    bitsOfMyLife: ReadonlyArray<BitOfMyLife>
}
