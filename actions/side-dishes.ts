/**
 * @file side-dishes.ts
 * @description Server actions for side dish notes operations
 *
 * Server actions for creating, updating, and fetching side dish notes.
 */

'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';
import type { SideDishNote } from '@/types/restaurant';

/**
 * Create a side dish note
 */
export async function createSideDishNote(
  note: Omit<SideDishNote, 'id' | 'created_at' | 'updated_at'>
): Promise<SideDishNote | null> {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from('restaurant_side_dish_notes')
      .insert({
        ...note,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating side dish note:', error);
      throw new Error('Failed to create side dish note');
    }

    return data as SideDishNote;
  } catch (error) {
    console.error('Error in createSideDishNote:', error);
    return null;
  }
}

/**
 * Update a side dish note
 */
export async function updateSideDishNote(
  id: string,
  updates: Partial<Omit<SideDishNote, 'id' | 'created_at' | 'updated_at'>>
): Promise<SideDishNote | null> {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from('restaurant_side_dish_notes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating side dish note:', error);
      throw new Error('Failed to update side dish note');
    }

    return data as SideDishNote;
  } catch (error) {
    console.error('Error in updateSideDishNote:', error);
    return null;
  }
}

/**
 * Delete a side dish note
 */
export async function deleteSideDishNote(id: string): Promise<boolean> {
  try {
    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from('restaurant_side_dish_notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting side dish note:', error);
      throw new Error('Failed to delete side dish note');
    }

    return true;
  } catch (error) {
    console.error('Error in deleteSideDishNote:', error);
    return false;
  }
}

/**
 * Get side dish notes for a restaurant
 */
export async function getSideDishNotes(restaurantId: string): Promise<SideDishNote[]> {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from('restaurant_side_dish_notes')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching side dish notes:', error);
      throw new Error('Failed to fetch side dish notes');
    }

    return (data as SideDishNote[]) || [];
  } catch (error) {
    console.error('Error in getSideDishNotes:', error);
    return [];
  }
}

