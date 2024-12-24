
export type Milestone = {
    id: number;
    date: Date;
    note: string
}
export type Milestones = {
    name: string;
    milestones: ReadonlyArray<Milestone>;
}
export type MilestonesMngr = ReadonlyMap<number, Milestones>;

export type Timeline = {
    name: string;
    mainDate: Date;
}
export type TimelinesMngr = ReadonlyMap<number, Timeline>;

export type Elapse = {
    years: number;
    months: number;
    days: number;
}
export type BitOfMyLife = {
    milestone: Milestone;
    diff: Elapse
}
export type BitsOfMyLife = {
    milestonesName: string;
    timelineName: string;
    timelineMainDate: Date;
    bits: ReadonlyArray<BitOfMyLife>
}

export type BitOfMyLifeToAdd = {
    date: Date;
    note: string
}

export type BitOfMyLifeToEdit = {
    id: number;
    date: Date;
    note: string
}

