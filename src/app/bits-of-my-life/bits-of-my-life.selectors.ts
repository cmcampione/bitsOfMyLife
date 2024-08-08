import moment from 'moment';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import {BitOfMyLife, BitsOfMyLife, Elapse, MileStone } from './bits-of-my-life.models';
import { BitsOfMyLifeState as BitsOfMyLifeState } from './bits-of-my-life.state';
import { defaultMileStonesName, defaultTimelineName } from './bits-of-my-life.reducer';

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

const selectBitsOfMyLifeStateState = createFeatureSelector<BitsOfMyLifeState>('BitsOfMyLifeState');

export const selectBitsOfMyLife = createSelector(selectBitsOfMyLifeStateState, (state: BitsOfMyLifeState) : BitsOfMyLife => {
  const todayMileStone: MileStone = {
    date: new Date(),
    note: 'Now'
  };
  const todayBitOfMyLife : BitOfMyLife = {
    mileStone: todayMileStone,
    diff: {
      years:0,
      mounths:0,
      days:0
    }
  };

  let mileStones = state.mileStonesMngr.get(state.selectedMileStonesId);
  if (!mileStones) {
    const emptyBitsOfMyLife: BitsOfMyLife = {
      mileStonesName: defaultMileStonesName,
      timelineName: defaultTimelineName,
      timelineMainDate: new Date(),
      bits: [todayBitOfMyLife]
    }
    return emptyBitsOfMyLife;
  }

  let timeline = state.timelinesMngr.get(state.selectedTimelineId);
  if (!timeline) {
    let bits = mileStones.mileStones.map(( mileStone: MileStone ) => {
      return {
      mileStone: mileStone,
      diff: diffDate(todayMileStone.date, mileStone.date)
    }});
    bits = [...bits,todayBitOfMyLife].sort((a, b) => new Date(a.mileStone.date).getTime() - new Date(b.mileStone.date).getTime());

    return {
      mileStonesName: mileStones.name,
      timelineMainDate: new Date(),
      timelineName: defaultTimelineName,
      bits: bits
    }}

  let bits = mileStones.mileStones.map(( mileStone: MileStone ) => {
    return {
    mileStone: mileStone,
    diff: diffDate(timeline.mainDate, mileStone.date)
  }});
  bits = [...bits,todayBitOfMyLife].sort((a, b) => new Date(a.mileStone.date).getTime() - new Date(b.mileStone.date).getTime());
  
  return {
      mileStonesName: mileStones.name,
      timelineMainDate: timeline.mainDate,
      timelineName: timeline.name,
      bits: bits
  }
})
