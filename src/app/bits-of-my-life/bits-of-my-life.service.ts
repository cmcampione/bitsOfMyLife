import { Injectable } from '@angular/core';
import { BitsOfMyLifeState } from './bits-of-my-life.state';
import { defaultTimelineId, defaultTimelineIndex, initialBitsOfMyLifeState } from './bits-of-my-life.reducer';
import { Milestones, Milestone, MilestonesMngr, Timeline, MilestoneToAdd, MilestoneToEdit, TimelinesMngr } from './bits-of-my-life.models';

@Injectable({
  providedIn: 'root'
})
export class BitsOfMyLifeService {
        
    private readonly storageKey = 'bitsOfMyLifeState';
  
    private serializeBitsOfMyLifeState(state: BitsOfMyLifeState): string {
      try {
          return JSON.stringify({
          version: state.version,
          milestonesMngr: state.milestonesMngr,
          timelinesMngr: state.timelinesMngr,
          selectedMilestonesIndex: state.selectedMilestonesIndex,
          selectedTimelineId: state.selectedTimelineId,
          selectedTimelineIndex: state.selectedTimelineIndex
        });
      }
      catch(error) {        
        throw new Error(String(error), {cause: 1});
      }
    }
  
    private deserializeBitsOfMyLifeState(json: string): BitsOfMyLifeState {
      const parsed = JSON.parse(json);
      try {
        let state: BitsOfMyLifeState = {
          version: parsed.version,

          milestonesMngr: parsed.milestonesMngr.map((milestones: Milestones) => ({
            ...milestones,
            milestones: milestones.milestones.map((milestone: Milestone) => ({
              ...milestone,
              date: new Date(milestone.date) // Convert ISO string to Date
            }))})),

          timelinesMngr: parsed.timelinesMngr.map((timeline: Timeline) => ({
            ...timeline,
            mainDate: new Date(timeline.mainDate) // Convert ISO string to Date
            })),

          selectedMilestonesIndex: parsed.selectedMilestonesIndex,
          selectedTimelineId: parsed.selectedTimelineId,
          selectedTimelineIndex: parsed.selectedTimelineIndex
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0); // azzera ore, minuti, secondi e millisecondi per confronto

        const timelinesMngrUpdated = state.timelinesMngr.map(tl => {
          if (tl.id === defaultTimelineId) {
            const tlDate = new Date(tl.mainDate);
            tlDate.setHours(0, 0, 0, 0);

            // aggiorna solo se la data è diversa da oggi
            return tlDate.getTime() !== today.getTime() ? { ...tl, mainDate: new Date() } : tl;
          }
          return tl;
        });

        state.timelinesMngr = timelinesMngrUpdated.sort(
          (a, b) => a.mainDate.getTime() - b.mainDate.getTime()
        );

        return state;
      }
      catch(error) {        
        throw new Error(String(error), {cause: 2});
      }
    }
  
    /** Saves the current state to localStorage asynchronously.
    * @param state State to save.
    */
    // Todo: To check, don't know if useful for public access
    async saveState(state: BitsOfMyLifeState): Promise<void> {
      const serializedState = this.serializeBitsOfMyLifeState(state);
      await Promise.resolve(localStorage.setItem(this.storageKey, serializedState));
    }
   
    /**
      * Loads the state from localStorage asynchronously.
      * @returns The deserialized state or a default empty object.
      */
    async loadState(): Promise<BitsOfMyLifeState> {
      const serializedState = await Promise.resolve(localStorage.getItem(this.storageKey));
      if (serializedState) {
          return this.deserializeBitsOfMyLifeState(serializedState);
      }
      // No saved data, return default state
      return this.getDefaultState();
    }

    /**
     * Adds a new `Milestone` to the state.
     * @param milestoneToAdd The new item to add.
     * @returns The updated state.
     */
    async addMilestone(state: BitsOfMyLifeState, milestoneToAdd: MilestoneToAdd): Promise<Milestone> {
      
      // Create the new Milestone
      const newMilestone: Milestone = {
        id: crypto.randomUUID(),
        date: milestoneToAdd.date,
        note: milestoneToAdd.note,
      };

      // Get the selected milestones
      const selectedMilestones = state.milestonesMngr[state.selectedMilestonesIndex];
      if (!selectedMilestones) {
        throw new Error('Selected Milestones not found. Unable to add the Milestone.',{cause: 3});
      }

      // Update the selected milestones with the new Milestone
      const updatedMilestones: Milestones = {
        ...selectedMilestones,
        milestones: [...selectedMilestones.milestones, newMilestone],
      };

      // Create a new updated manager
      const updatedMilestonesMngr = state.milestonesMngr.map((milestones, index) =>
        index === state.selectedMilestonesIndex ? updatedMilestones : milestones
      );
    
      // Update the state
      const updatedState: BitsOfMyLifeState = {
        ...state,
        milestonesMngr: updatedMilestonesMngr,
      };

      // Save the updated state to localStorage
      await this.saveState(updatedState);

      // Return the updated state
      return newMilestone;
    }

    async editMilestone(state: BitsOfMyLifeState, milestoneToEdit: MilestoneToEdit): Promise<Milestone> {
      // Get the selected milestones
      const selectedMilestones = state.milestonesMngr[state.selectedMilestonesIndex];
      if (!selectedMilestones) {
        throw new Error('Selected Milestones not found. Unable to edit the milestone.', {cause: 4});
      }
    
      // Find the milestone to edit
      const milestoneIndex = selectedMilestones.milestones.findIndex((milestone) => milestone.id === milestoneToEdit.id);
      if (milestoneIndex === -1) {
        throw new Error('Milestone not found. Unable to edit the milestone.', {cause: 5});
      }
    
      // Create the new milestone with the edited data
      const updatedMilestone: Milestone = {
        ...selectedMilestones.milestones[milestoneIndex],
        date: milestoneToEdit.date,
        note: milestoneToEdit.note,
      };
    
      // Update the list of milestones
      const updatedMilestones: Milestones = {
        ...selectedMilestones,
        milestones: [
          ...selectedMilestones.milestones.slice(0, milestoneIndex),
          updatedMilestone,
          ...selectedMilestones.milestones.slice(milestoneIndex + 1),
        ],
      };
    
      // Create a new updated manager
      const updatedMilestonesMngr = state.milestonesMngr.map((milestone, index) =>
        index === state.selectedMilestonesIndex ? updatedMilestones : milestone
      );
    
      // Update the state
      const updatedState: BitsOfMyLifeState = {
        ...state,
        milestonesMngr: updatedMilestonesMngr,
      };
    
      // Save the updated state to localStorage
      await this.saveState(updatedState);
    
      // Return the updated state
      return updatedMilestone;
    }

    /**
   * Removes a `Milestone` from the state given its ID.
   * @param state The current state.
   * @param milestoneId The ID of the milestone to remove.
   * @returns The updated state.
   */
    async deleteMilestone(state: BitsOfMyLifeState, milestoneId: string): Promise<string> {
      // Find the selected milestones
      const selectedMilestones = state.milestonesMngr[state.selectedMilestonesIndex];
      if (!selectedMilestones) {
        throw new Error('Selected Milestones not found. Unable to remove the milestone.', {cause: 6});
      }

      // Find the milestone to delete
      const milestoneIndex = selectedMilestones.milestones.findIndex((milestone) => milestone.id === milestoneId);
      if (milestoneIndex === -1) {
        throw new Error('Milestone not found. Unable to delete the milestone.', {cause: 7});
      }

      // Update the selected milestones
      const updatedMilestones: Milestones = {
        ...selectedMilestones,
        milestones: [...selectedMilestones.milestones.slice(0, milestoneIndex), 
          ...selectedMilestones.milestones.slice(milestoneIndex + 1)],
      };

      // Create a new updated manager
      const updatedMilestonesMngr = state.milestonesMngr.map((milestone, index) =>
        index === state.selectedMilestonesIndex ? updatedMilestones : milestone
      );

      // Update the state
      const updatedState: BitsOfMyLifeState = {
        ...state,
        milestonesMngr: updatedMilestonesMngr,
      };

      // Save the updated state to localStorage
      await this.saveState(updatedState);

      // Return the updated state
      return milestoneId;
    }

    async deleteSelectedTimeline(state: BitsOfMyLifeState): Promise<string> {

      if (state.selectedTimelineId === defaultTimelineId) {
        throw new Error("Critical error", { cause: 8 });
      }

      const selectedTimelineIdToRemove = state.selectedTimelineId;

      const updatedTimelinesMngr = state.timelinesMngr.filter((timeline) => timeline.id !== selectedTimelineIdToRemove);
      const updatedState: BitsOfMyLifeState = {
        ...state,
        timelinesMngr: updatedTimelinesMngr,
        selectedTimelineId: defaultTimelineId,
        selectedTimelineIndex: updatedTimelinesMngr.findIndex((timeline) => timeline.id === defaultTimelineId),
      };

      await this.saveState(updatedState);

      return selectedTimelineIdToRemove;
    }

    async selectOrAddPrevTimeline(state: BitsOfMyLifeState): Promise<{isSelected: boolean; timelineIndex: number; timeline: Timeline }> {
      if (state.selectedTimelineIndex > 0) {
          const prevTimelineIndex = state.selectedTimelineIndex - 1;
          const prevTimeline = state.timelinesMngr[prevTimelineIndex];
          const updatedState = {
            ...state, 
            selectedTimelineId: prevTimeline.id,
            selectedTimelineIndex: prevTimelineIndex
          };

          await this.saveState(updatedState);
          
          return { isSelected: true, timelineIndex: prevTimelineIndex, timeline: prevTimeline };
      }

      // If we are already at the first index, create a new timeline
      const newTimeline: Timeline = { 
        id: crypto.randomUUID(),
        name: 'New Prev Timeline', 
        mainDate: new Date() 
      };
      const updatedTimelinesMngr = [newTimeline, ...state.timelinesMngr];
      const updatedState = {
        ...state, 
        timelinesMngr: updatedTimelinesMngr, 
        selectedTimelineId: newTimeline.id,
        selectedTimelineIndex: 0
      };

      await this.saveState(updatedState);
      
      return { isSelected: false, timelineIndex: 0, timeline: newTimeline };
    }

    async selectOrAddNextTimeline(state: BitsOfMyLifeState): Promise<{isSelected: boolean; timelineIndex: number; timeline: Timeline }> {
      let nextTimelineIndex = state.selectedTimelineIndex + 1;
      let updatedTimelinesMngr = state.timelinesMngr;

      let selected = true
  
      if (nextTimelineIndex === state.timelinesMngr.length) {
          const newTimeline: Timeline = {
            id: crypto.randomUUID(),
            name: 'New Next Timeline', 
            mainDate: new Date() 
          };
          updatedTimelinesMngr = [...state.timelinesMngr, newTimeline];          
          selected = false
      }
  
      const updatedState: BitsOfMyLifeState = { 
          ...state, 
          timelinesMngr: updatedTimelinesMngr,
          selectedTimelineId: updatedTimelinesMngr[nextTimelineIndex].id,
          selectedTimelineIndex: nextTimelineIndex 
      };
  
      await this.saveState(updatedState);
  
      return {isSelected : selected, timelineIndex: nextTimelineIndex, timeline: updatedTimelinesMngr[nextTimelineIndex] };
    }

    async selectTimelineById(state: BitsOfMyLifeState, timelineId: string): Promise<{ timelineId: string }> {
      const timelineIndex = state.timelinesMngr.findIndex(t => t.id === timelineId);

      if (timelineIndex === -1) {
        throw new Error('Timeline ID not found. Unable to select the timeline.', { cause: 13 });
      }

      const updatedState: BitsOfMyLifeState = { 
        ...state, 
        timelinesMngr: state.timelinesMngr,
        selectedTimelineId: timelineId,
        selectedTimelineIndex: timelineIndex
      };

      await this.saveState(updatedState);

      return { timelineId };
    }

    async addTimeline(state: BitsOfMyLifeState, timelineToAdd: Timeline): Promise<Timeline> {
      
      const newTimeline: Timeline = {
        ...timelineToAdd,
        id: crypto.randomUUID(),
      };

      const updatedTimelinesMngr = [...state.timelinesMngr, newTimeline];
      const updatedState: BitsOfMyLifeState = {
        ...state,
        timelinesMngr: updatedTimelinesMngr,
        selectedTimelineId: newTimeline.id,
        selectedTimelineIndex: updatedTimelinesMngr.length - 1
      };

      await this.saveState(updatedState);

      return newTimeline;
    }

    async updateTimeline(state: BitsOfMyLifeState, timelineToEdit: Timeline): Promise<Timeline> {
      
      const updatedTimelinesMngr = state.timelinesMngr.map((timeline) =>
        timeline.id === state.selectedTimelineId ? timelineToEdit : timeline
      );

      const updatedState: BitsOfMyLifeState = {
        ...state,
        timelinesMngr: updatedTimelinesMngr,
      };

      await this.saveState(updatedState);

      return timelineToEdit;
    }

    async deleteTimelineById(state: BitsOfMyLifeState, timelineId: string): Promise<string> {

      if (timelineId === defaultTimelineId) {
        throw new Error("Critical error", { cause: 14 });
      }

      const timelineIndex = state.timelinesMngr.findIndex(t => t.id === timelineId);

      if (timelineIndex === -1) {
        throw new Error('Timeline ID not found. Unable to delete the timeline.', { cause: 15 });
      }

      const updatedTimelinesMngr = state.timelinesMngr.filter((timeline) => timeline.id !== timelineId);

      let newSelectedTimelineId = state.selectedTimelineId;
      let newSelectedTimelineIndex = state.selectedTimelineIndex;

      // If the deleted timeline was the selected one, update the selection
      if (state.selectedTimelineId === timelineId) {
        if (updatedTimelinesMngr.length > 0) {
          // Select the previous timeline if possible, otherwise the next one
          if (timelineIndex > 0) {
            newSelectedTimelineId = updatedTimelinesMngr[timelineIndex - 1].id;
            newSelectedTimelineIndex = timelineIndex - 1;
          } else {
            newSelectedTimelineId = updatedTimelinesMngr[0].id;
            newSelectedTimelineIndex = 0;
          }
        } else {
          // If no timelines are left, revert to default
          newSelectedTimelineId = defaultTimelineId;
          newSelectedTimelineIndex = defaultTimelineIndex;
        }
      } else if (timelineIndex < state.selectedTimelineIndex) {
        // If a timeline before the selected one was deleted, adjust the index
        newSelectedTimelineIndex -= 1;
      }

      const updatedState: BitsOfMyLifeState = {
        ...state,
        timelinesMngr: updatedTimelinesMngr,
        selectedTimelineId: newSelectedTimelineId,
        selectedTimelineIndex: newSelectedTimelineIndex
      };

      await this.saveState(updatedState);

      return timelineId;
    }
      
    /**
     * Clears the state from localStorage asynchronously.
     */
    // Todo: To check, don't know if useful
    async clearState(): Promise<void> {
        await Promise.resolve(localStorage.removeItem(this.storageKey));
    }

    /**
     * Returns a default state.
     * @returns Default state.
     */
    private getDefaultState(): BitsOfMyLifeState {
      return initialBitsOfMyLifeState;
    }
}
