import { Injectable } from '@angular/core';
import { BitsOfMyLifeState } from './bits-of-my-life.state';
import { defaultTimelineIndex, initialBitsOfMyLifeState } from './bits-of-my-life.reducer';
import { Milestones, Milestone, MilestonesMngr, Timeline, MilestoneToAdd, MilestoneToEdit } from './bits-of-my-life.models';

@Injectable({
  providedIn: 'root'
})
export class BitsOfMyLifeService {
        
    private readonly storageKey = 'bitsOfMyLifeState';
  
    private serializeBitsOfMyLifeState(state: BitsOfMyLifeState): string {
      return JSON.stringify({
        version: state.version,
        milestonesMngr: state.milestonesMngr,
        timelinesMngr: state.timelinesMngr,
        selectedMilestonesIndex: state.selectedMilestonesIndex,
        selectedTimelineIndex: state.selectedTimelineIndex
      });
    }
  
    private deserializeBitsOfMyLifeState(json: string): BitsOfMyLifeState {
      const parsed = JSON.parse(json);
  
      return {
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
        selectedTimelineIndex: parsed.selectedTimelineIndex
      };
    }
  
    /** Saves the current state to localStorage asynchronously.
    * @param state State to save.
    */
    // Todo: To check, don't know if useful for public access
    async saveState(state: BitsOfMyLifeState): Promise<void> {
        try {
            const serializedState = this.serializeBitsOfMyLifeState(state);
            await Promise.resolve(localStorage.setItem(this.storageKey, serializedState));
        } catch (error) {
            console.error('Error saving state:', error);
            // Rethrow the exception to be handled by the caller
            throw new Error(`Critical error saving state`);
        }
    }
   
    /**
      * Loads the state from localStorage asynchronously.
      * @returns The deserialized state or a default empty object.
      */
    async loadState(): Promise<BitsOfMyLifeState> {
        try {
            const serializedState = await Promise.resolve(localStorage.getItem(this.storageKey));
            if (serializedState) {
                return this.deserializeBitsOfMyLifeState(serializedState);
            }
            // No saved data, return default state
            return this.getDefaultState();
        } catch (error) {
            console.error('Error loading state:', error);
    
            // If it's a parsing or access issue, rethrow the exception
            throw new Error(`Critical error loading state`);
        }
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
        throw new Error('Selected Milestones not found. Unable to add the milestone.');
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
        throw new Error('Selected Milestones not found. Unable to edit the milestone.');
      }
    
      // Find the milestone to edit
      const milestoneIndex = selectedMilestones.milestones.findIndex((milestone) => milestone.id === milestoneToEdit.id);
      if (milestoneIndex === -1) {
        throw new Error('Milestone not found. Unable to edit the milestone.');
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
        throw new Error('Selected Milestones not found. Unable to remove the milestone.');
      }

      // Find the milestone to delete
      const milestoneIndex = selectedMilestones.milestones.findIndex((milestone) => milestone.id === milestoneId);
      if (milestoneIndex === -1) {
        throw new Error('Milestone not found. Unable to delete the milestone.');
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

    async editSelectedTimeline(state: BitsOfMyLifeState, timelineToEdit: Timeline): Promise<Timeline> {
      
      if (state.selectedTimelineIndex < 0 || state.selectedTimelineIndex >= state.timelinesMngr.length) {
        throw new Error("Critical error");
      }

      const updatedTimelinesMngr = state.timelinesMngr.map((timeline, index) =>
        index === state.selectedTimelineIndex ? timelineToEdit : timeline
      );

      const updatedState: BitsOfMyLifeState = {
        ...state,
        timelinesMngr: updatedTimelinesMngr,
      };

      await this.saveState(updatedState);

      return timelineToEdit;
    }

    async deleteSelectedTimeline(state: BitsOfMyLifeState, timelineIndexToRemove: number): Promise<number> {
      if (state.selectedTimelineIndex < 0 || state.selectedTimelineIndex === defaultTimelineIndex || state.selectedTimelineIndex >= state.timelinesMngr.length) {
        throw new Error("Critical error");
      }

      const updatedTimelinesMngr = state.timelinesMngr.filter((timeline, index) => index !== timelineIndexToRemove);
      const updatedState: BitsOfMyLifeState = {
        ...state,
        timelinesMngr: updatedTimelinesMngr,
        selectedTimelineIndex: defaultTimelineIndex,
      };

      await this.saveState(updatedState);

      return 0;
    }

    async selectOrAddNextTimeline(state: BitsOfMyLifeState): Promise<{isSelected: boolean; timelineIndex: number; timeline: Timeline }> {
      let nextTimelineIndex = state.selectedTimelineIndex + 1;
      let updatedTimelinesMngr = state.timelinesMngr;
      let selected = true
  
      if (nextTimelineIndex === state.timelinesMngr.length) {
          const newTimeline: Timeline = { name: 'New Next Timeline', mainDate: new Date() };
          updatedTimelinesMngr = [...state.timelinesMngr, newTimeline];          
          selected = false
      }
  
      const updatedState: BitsOfMyLifeState = { 
          ...state, 
          timelinesMngr: updatedTimelinesMngr, 
          selectedTimelineIndex: nextTimelineIndex 
      };
  
      await this.saveState(updatedState);
  
      return {isSelected : selected, timelineIndex: nextTimelineIndex, timeline: updatedTimelinesMngr[nextTimelineIndex] };
    }
  
    async selectOrAddPrevTimeline(state: BitsOfMyLifeState): Promise<{isSelected: boolean; timelineIndex: number; timeline: Timeline }> {
      if (state.selectedTimelineIndex > 0) {
          const prevTimelineIndex = state.selectedTimelineIndex - 1;
          const updatedState = { ...state, selectedTimelineIndex: prevTimelineIndex };

          await this.saveState(updatedState);
          
          return { isSelected: true, timelineIndex: prevTimelineIndex, timeline: state.timelinesMngr[prevTimelineIndex] };
      }

      // If we are already at the first index, create a new timeline
      const newTimeline: Timeline = { name: 'New Prev Timeline', mainDate: new Date() };
      const updatedTimelinesMngr = [newTimeline, ...state.timelinesMngr];
      const updatedState = { ...state, timelinesMngr: updatedTimelinesMngr, selectedTimelineIndex: 0 };

      await this.saveState(updatedState);
      
      return { isSelected: false, timelineIndex: 0, timeline: newTimeline };
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
