import { Injectable } from '@angular/core';
import { BitsOfMyLifeState } from './bits-of-my-life.state';
import { initialBitsOfMyLifeState } from './bits-of-my-life.reducer';
import { Milestones, Milestone, MilestonesMngr, Timeline, TimelinesMngr, MilestoneToAdd, MilestoneToEdit } from './bits-of-my-life.models';

@Injectable({
  providedIn: 'root'
})
export class BitsOfMyLifeService {

    private readonly storageKey = 'bitsOfMyLifeState';
  
    private serializeBitsOfMyLifeState(state: BitsOfMyLifeState): string {
      return JSON.stringify({
        version: state.version,
        milestonesMngr: Array.from(state.milestonesMngr.entries()), // Convert Map to array
        timelinesMngr: Array.from(state.timelinesMngr.entries()),  // Convert Map to array
        selectedMilestonesId: state.selectedMilestonesId,
        selectedTimelineId: state.selectedTimelineId
      });
    }
  
    private deserializeBitsOfMyLifeState(json: string): BitsOfMyLifeState {
      const parsed = JSON.parse(json);
  
      return {
        version: parsed.version,
        milestonesMngr: new Map(
          parsed.milestonesMngr.map(([id, milestones]: [number, Milestones]) => [
            id,
            {
              ...milestones,
              milestones: milestones.milestones.map((ms: Milestone) => ({
                ...ms,
                date: new Date(ms.date) // Convert ISO string to Date
              }))
            }
          ])
        ) as MilestonesMngr,
        timelinesMngr: new Map(
          parsed.timelinesMngr.map(([id, timeline]: [number, Timeline]) => [
            id,
            {
              ...timeline,
              mainDate: new Date(timeline.mainDate) // Convert ISO string to Date
            }
          ])
        ) as TimelinesMngr,
        selectedMilestonesId: parsed.selectedMilestonesId,
        selectedTimelineId: parsed.selectedTimelineId
      };
    }
  
    /** Saves the current state to localStorage asynchronously.
    * @param state State to save.
    */
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
      const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
      if (!selectedMilestones) {
        throw new Error('Selected Milestones not found. Unable to add the milestone.');
      }

      // Update the selected milestones with the new Milestone
      const updatedMilestones: Milestones = {
        ...selectedMilestones,
        milestones: [...selectedMilestones.milestones, newMilestone],
      };

      // Create a new updated manager
      const updatedMilestonesMngr = new Map(state.milestonesMngr).set(
        state.selectedMilestonesId,
        updatedMilestones
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
      const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
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
      const updatedMilestonesMngr = new Map(state.milestonesMngr).set(
        state.selectedMilestonesId,
        updatedMilestones
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
      const selectedMilestones = state.milestonesMngr.get(state.selectedMilestonesId);
      if (!selectedMilestones) {
        throw new Error('Selected Milestones not found. Unable to remove the milestone.');
      }

      // Filter to remove the milestone with the specified ID
      const filteredMilestones = selectedMilestones.milestones.filter(
        (milestone) => milestone.id !== milestoneId
      );

      // Update the selected milestones
      const updatedMilestones: Milestones = {
        ...selectedMilestones,
        milestones: filteredMilestones,
      };

      // Create a new updated manager
      const updatedMilestonesMngr = new Map(state.milestonesMngr).set(
        state.selectedMilestonesId,
        updatedMilestones
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
   
    /**
     * Clears the state from localStorage asynchronously.
     */
    // ToDo: To remove
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
