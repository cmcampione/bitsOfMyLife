
export type Milestone = {
    id: string;
    date: Date;
    note: string
}
export type Milestones = {
    //id: string;
    name: string;
    milestones: ReadonlyArray<Milestone>;
}
export type MilestonesMngr = ReadonlyArray<Milestones>;

export type MilestoneToAdd = {
    date: Date;
    note: string
}
export type MilestoneToEdit = {
    id: string;
    date: Date;
    note: string
}

export type Timeline = {
    id: string;
    name: string;
    mainDate: Date;
}
export type TimelinesMngr = ReadonlyArray<Timeline>;

export type Elapse = {
    years: number;
    months: number;
    days: number;
}
export type BitOfMyLife = {
    milestone: Milestone;
    diff: Elapse
}
