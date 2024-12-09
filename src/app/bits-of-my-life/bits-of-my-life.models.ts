
export type MileStone = {
    date: Date;
    note: string
}
export type MileStones = {
    name: string;
    mileStones: ReadonlyArray<MileStone>;
}
export type MileStonesMngr = ReadonlyMap<number, MileStones>;

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
    mileStone: MileStone;
    diff: Elapse
}
export type BitsOfMyLife = {
    mileStonesName: string;
    timelineName: string;
    timelineMainDate: Date;
    bits: ReadonlyArray<BitOfMyLife>
}

export type BitOfMyLifeToAdd = {
    date: Date;
    note: string
}

