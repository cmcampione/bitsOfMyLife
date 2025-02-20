
export type Milestone = {
    id: string;
    date: Date;
    note: string
}
export type Milestones = {
    name: string;
    milestones: ReadonlyArray<Milestone>;
}
export type MilestonesMngr = ReadonlyMap<number, Milestones>;

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



