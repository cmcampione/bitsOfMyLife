import { createReducer, on } from "@ngrx/store";
import { MileStone, MileStones, MileStonesMngr, Timeline } from "./bits-of-my-life.models";
import { BitsOfMyLifeState } from "./bits-of-my-life.state";
import * as BitsOfMyLifeActions from './bits-of-my-life.actions';

//////////////////////////////////////////////////////////////////////////////////////////////

export const defaultMileStonesId = 1;
export const defaultMileStonesName = 'Default';

export const defaultTimelineId = 1;
export const defaultTimelineName = 'Default';

let defaultMileStones: MileStones = {
    name: defaultMileStonesName,
    mileStones: [{
        note: 'I was born',
        date: new Date("1962-08-19")
    },
    {        
        note: 'I married',
        date: new Date("1988-07-27")
    }]
}

let defaultTimeline: Timeline = {
    name: defaultTimelineName,
    mainDate: new Date
}

export const initialBitsOfMyLifeState: BitsOfMyLifeState = {

    // Why: I can't do "mileStonesMngr: new MileStonesMngr([[defaultMileStonesId, new Array<MileStone>]])" ?
    mileStonesMngr: new Map([
        [defaultMileStonesId, defaultMileStones]
    ]),

    // Why: I can't do "timelinesMngr: new TimelinesMngr([[defaultTimelineId, new Array<Timeline>]])" ?
    timelinesMngr: new Map<number, Timeline>([
        [defaultTimelineId, defaultTimeline]
    ]),
    
    selectedMileStonesId: defaultMileStonesId,
    selectedTimelineId: defaultTimelineId
}

export const bitsOfMyLifeReducer = createReducer(
    initialBitsOfMyLifeState,
    on(BitsOfMyLifeActions.addBitOfMyLife, (state, { bitOfMyLife }) => {
        // Creazione del nuovo MileStone
        const newMileStone: MileStone = {
            date: bitOfMyLife.date,
            note: bitOfMyLife.note,
        };

        // Ottieni i traguardi selezionati
        const selectedMileStones = state.mileStonesMngr.get(state.selectedMileStonesId);

        if (!selectedMileStones) {
            console.error("Selected MileStones not found. Unable to add the milestone.");
            return state; // Restituisci lo stato invariato per gestire l'errore
        }

        // Aggiorna i traguardi selezionati con il nuovo MileStone
        const updatedMileStones: MileStones = {
            ...selectedMileStones,
            mileStones: [...selectedMileStones.mileStones, newMileStone]
                .sort((a, b) => a.date.getTime() - b.date.getTime()), // Ordina per data
        };

        // Crea un nuovo manager aggiornato
        const updatedMileStonesMngr: MileStonesMngr = new Map(state.mileStonesMngr).set(
            state.selectedMileStonesId,
            updatedMileStones
        );

        // Restituisci il nuovo stato
        return {
            ...state,
            mileStonesMngr: updatedMileStonesMngr,
        };
    }),
    on(BitsOfMyLifeActions.stateLoaded, (state, { state: loadedState }) => ({ ...loadedState })),    
    on(BitsOfMyLifeActions.saveState, (state) => ({ ...state })), // Non modifica nulla, ma intercetta l'azione
    on(BitsOfMyLifeActions.clearState, () => ({ ...initialBitsOfMyLifeState }))
);
