import moment from 'moment';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import {BitOfMyLife, Elapse, Milestone } from './bits-of-my-life.models';
import { BitsOfMyLifeState as BitsOfMyLifeState, SelectedBitsOfMyLifeState } from './bits-of-my-life.state';
import { defaultMilestonesName, defaultTimelineId, defaultTimelineName } from './bits-of-my-life.reducer';

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

  return { years: years, months: months, days: days };
}

export const todayMilestoneId = 0;

export const selectBitsOfMyLifeState = createFeatureSelector<BitsOfMyLifeState>('BitsOfMyLifeState');

export const selectSelectedBitsOfMyLife = createSelector(
  selectBitsOfMyLifeState,
  (state: BitsOfMyLifeState): SelectedBitsOfMyLifeState => {
    const todayMilestone: Milestone = {
      id: todayMilestoneId,
      date: new Date(),
      note: 'Now', // ToDo: To localize
    };

    const todayBitOfMyLife: BitOfMyLife = {
      milestone: todayMilestone,
      diff: { years: 0, months: 0, days: 0 },
    };

    const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
    const timeline = state.timelinesMngr.get(state.selectedTimelineId);
    if (timeline?.mainDate && state.selectedTimelineId === defaultTimelineId)
      timeline.mainDate = new Date();

    if (!selectedMilestones) {
      return {
        milestonesName: defaultMilestonesName,
        timelineName: defaultTimelineName,
        timelineMainDate: new Date(),
        bitsOfMyLife: [todayBitOfMyLife],
      };
    }

    const timelineMainDate = timeline ? timeline.mainDate : new Date();
    const timelineName = timeline ? timeline.name : defaultTimelineName;

    const bitsOfMyLife = [
      ...selectedMilestones.milestones.map((milestone: Milestone) => ({
        milestone,
        diff: diffDate(timelineMainDate, milestone.date),
      })),
      todayBitOfMyLife,
    ].sort((a, b) => new Date(a.milestone.date).getTime() - new Date(b.milestone.date).getTime());

    return {
      milestonesName: selectedMilestones.name,
      timelineMainDate,
      timelineName,
      bitsOfMyLife,
    };
  }
);
