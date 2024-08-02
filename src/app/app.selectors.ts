import moment from 'moment';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import {BitOfMyLife, BitsOfMyLife, Elapse, MileStone } from './app.models';
import { BitsOfMyLifeState as BitsOfMyLifeState } from './app.state';
import { defaultMileStonesName, defaultTimelineName } from './app.reducers';

function diffDate(data1: Date, data2: Date): Elapse {
  // Crea oggetti moment per le due date
  const start = moment(data1);
  const end = moment(data2);

  // Calcola la differenza tra le due date in anni, mesi e giorni
  const years = end.diff(start, 'years');
  start.add(years, 'years'); // Aggiungi gli anni calcolati per la successiva differenza di mesi e giorni

  const months = end.diff(start, 'months');
  start.add(months, 'months'); // Aggiungi i mesi calcolati per la successiva differenza di giorni

  const days = end.diff(start, 'days');

  return { years: years, mounths: months, days: days };
}

const selectAppState = createFeatureSelector<BitsOfMyLifeState>('BitsOfMyLifeState');

export const selectBitsOfMyLife = createSelector(selectAppState, (state: BitsOfMyLifeState) : BitsOfMyLife => {
  let emptyBitsOfMyLife: BitsOfMyLife = {
    mileStonesName: defaultMileStonesName,
    timelineName: defaultTimelineName,
    timelineMainDate: new Date(),
    bits: new Array<BitOfMyLife>()
  };
  
  let mileStones = state.mileStonesMngr.get(state.selectedMileStonesId);
  if (!mileStones)
    return emptyBitsOfMyLife;

  let timeline = state.timelinesMngr.get(state.selectedTimelineId);
  if (!timeline)
    return {
      mileStonesName: mileStones.name,
      timelineMainDate: new Date(),
      timelineName: defaultTimelineName,
      bits: mileStones.mileStones.map((mileStone: MileStone) => {
        return {
          mileStone: mileStone,
          diff: diffDate(new Date(), mileStone.date)
      }})
    }
  
  return {
      mileStonesName: mileStones.name,
      timelineMainDate: timeline.mainDate,
      timelineName: timeline.name,
      bits: mileStones.mileStones.map(( mileStone: MileStone ) => {
        return {
        mileStone: mileStone,
        diff: diffDate(timeline.mainDate, mileStone.date)
      }})
  }
})
