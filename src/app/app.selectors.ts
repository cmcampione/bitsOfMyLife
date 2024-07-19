import { createSelector, createFeatureSelector } from '@ngrx/store';
import {BitOfMyLife, BitsOfMyLife, MileStone } from './app.models';
import { AppState } from './app.state';
import { defaultMileStonesName, defaultTimelineName } from './app.reducer';

const selectAppState = createFeatureSelector<AppState>('AppState');

export const selectBitsOfMyLife = createSelector(selectAppState, (state: AppState) => {
  let emptyBitsOfMyLife: BitsOfMyLife = {
    mailStonesName: defaultMileStonesName,
    timelineName: defaultTimelineName,
    timelineMainDate: new Date(),
    bitsOfMyLife: new Array<BitOfMyLife>()
  };
  console.log(state.selectedMileStones);
  let mileStones = state.mileStonesMngr.get(state.selectedMileStones);
  if (!mileStones)
    return emptyBitsOfMyLife;

  let timeline = state.timelinesMngr.get(state.selectedTimeline);
  if (!timeline)
    return {
      mailStonesName: mileStones.name,
      timelineMainDate: new Date(),
      timelineName: defaultTimelineName,
      bitsOfMyLife: mileStones.mileStones.map((mileStone: MileStone) => {
        return {
          mileStone: mileStone,
          diff: 0
        }
      })
    }
  
  return {
      mailStonesName: mileStones.name,
      timelineMainDate: timeline.mainDate,
      timelineName: timeline.name,
      bitsOfMyLife: mileStones.mileStones.map(( mileStone: MileStone ) => {
        return {
        mileStone: mileStone,
        diff: 1 // ToDo: Compute diff
      }
    })
  }
})
