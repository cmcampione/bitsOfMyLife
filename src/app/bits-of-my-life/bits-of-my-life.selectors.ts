import moment from 'moment';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { BitOfMyLife, Elapse, Milestone } from './bits-of-my-life.models';
import { BitsOfMyLifeState as BitsOfMyLifeState, SelectedBitsOfMyLifeState } from './bits-of-my-life.state';
import { defaultMilestonesName, defaultTimelineId, defaultTimelineName } from './bits-of-my-life.reducer';

function diffDate(data1: Date, data2: Date): Elapse {
  // Create moment objects for the two dates
  const start = moment(data1);
  const end = moment(data2);

  // Calculate the difference between the two dates in years, months, and days
  const years = end.diff(start, 'years');
  start.add(years, 'years'); // Add the calculated years for the next difference of months and days

  const months = end.diff(start, 'months');
  start.add(months, 'months'); // Add the calculated months for the next difference of days

  const days = end.diff(start, 'days');

  return { years: years, months: months, days: days };
}

export const todayMilestoneId = "";

export const selectBitsOfMyLifeState = createFeatureSelector<BitsOfMyLifeState>('BitsOfMyLifeState');

const _selectTimelinesMngr = createSelector(
  selectBitsOfMyLifeState,
  (state: BitsOfMyLifeState) => state.timelinesMngr  
);
export const selectTimelinesMngr = createSelector(
  _selectTimelinesMngr,
  (timelinesMngr) => timelinesMngr.slice().sort((a, b) => a.mainDate.getTime() - b.mainDate.getTime())
);
export const selectSelectedTimelineId = createSelector(
  selectBitsOfMyLifeState,
  (state: BitsOfMyLifeState) => state.selectedTimelineId
);

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

    const selectedMilestones = state.milestonesMngr[state.selectedMilestonesIndex];
    
    const selectedTimeline = state.timelinesMngr[state.selectedTimelineIndex];
    const timelineMainDate = (state.selectedTimelineId === defaultTimelineId) ? now : (selectedTimeline?.mainDate ?? now);
    const timelineName = selectedTimeline?.name || defaultTimelineName;

    const todayBitOfMyLife: BitOfMyLife = {
      milestone: todayMilestone,
      diff: diffDate(timelineMainDate, now),
    };

    // If there are no selected milestones, return only today's bit
    if (!selectedMilestones) {
      return {
        milestonesIndex: state.selectedMilestonesIndex,        
        milestonesName: defaultMilestonesName,
        timelineId: selectedTimeline.id,
        timelineIndex: state.selectedTimelineIndex,
        timelineName: defaultTimelineName,
        timelineMainDate: timelineMainDate,
        timelinesLength: state.timelinesMngr.length,
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
      milestonesIndex: state.selectedMilestonesIndex,
      milestonesName: selectedMilestones.name,
      timelineId: selectedTimeline.id,
      timelineIndex: state.selectedTimelineIndex,
      timelineMainDate,
      timelineName,
      timelinesLength: state.timelinesMngr.length,
      bitsOfMyLife,
    };
  }
);
