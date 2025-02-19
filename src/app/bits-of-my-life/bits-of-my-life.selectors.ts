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

export const todayMilestoneId = "";

export const selectBitsOfMyLifeState = createFeatureSelector<BitsOfMyLifeState>('BitsOfMyLifeState');

export const selectSelectedBitsOfMyLife = createSelector(
  selectBitsOfMyLifeState,
  (state: BitsOfMyLifeState): SelectedBitsOfMyLifeState => {
    const now = new Date();

    // Create today's milestone with the current date
    const todayMilestone: Milestone = {
      id: todayMilestoneId,
      date: now,
      note: 'Now', // TODO: localize
    };

    const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
    const selectedTimeline = state.timelinesMngr.get(state.selectedTimelineId);

    // If the timeline is the default one, update its main date
    if (selectedTimeline?.mainDate && state.selectedTimelineId === defaultTimelineId) {
      selectedTimeline.mainDate = now;
    }

    const timelineMainDate = selectedTimeline?.mainDate || now;
    const timelineName = selectedTimeline?.name || defaultTimelineName;

    const todayBitOfMyLife: BitOfMyLife = {
      milestone: todayMilestone,
      diff: diffDate(timelineMainDate, now),
    };

    // If there are no selected milestones, return only today's bit
    if (!selectedMilestones) {
      return {
        milestonesName: defaultMilestonesName,
        timelineName: defaultTimelineName,
        timelineMainDate: now,
        bitsOfMyLife: [todayBitOfMyLife],
      };
    }

    // Map the selected milestones and add today's bit
    const bitsOfMyLife = selectedMilestones.milestones
      .map((milestone: Milestone) => ({
        milestone,
        diff: diffDate(timelineMainDate, milestone.date),
      }))
      .concat(todayBitOfMyLife)
      .sort(
        (a, b) =>
          new Date(a.milestone.date).getTime() - new Date(b.milestone.date).getTime()
      );

    return {
      milestonesName: selectedMilestones.name,
      timelineMainDate,
      timelineName,
      bitsOfMyLife,
    };
  }
);

