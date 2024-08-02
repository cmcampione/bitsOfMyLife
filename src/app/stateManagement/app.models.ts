
export type MileStone = {
    date: Date;
    note: string
}
export type MileStones = {
    name: string;
    mileStones: Array<MileStone>;
}
export type MileStonesMngr = Map<number, MileStones>;

export type Timeline = {
    name: string;
    mainDate: Date;
}
export type TimelinesMngr = Map<number, Timeline>;

export type Elapse = {
    years: number;
    mounths: number;
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
    bits: Array<BitOfMyLife>
}

export type BitOfMyLifeToAdd = {
    date: Date;
    note: string
}

