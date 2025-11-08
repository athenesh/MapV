/**
 * @file suggestions.ts
 * @description Server actions for restaurant edit suggestions
 *
 * Server actions for creating, fetching, and managing edit suggestions.
 */

'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';
import type { RestaurantEditSuggestion, EditSuggestionStatus } from '@/types/restaurant';

/**
 * Create an edit suggestion
 */
export async function createEditSuggestion(
  suggestion: Omit<RestaurantEditSuggestion, 'id' | 'created_at' | 'status'>
): Promise<RestaurantEditSuggestion | null> {
  try {
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from('restaurant_edit_suggestions')
      .insert({
        ...suggestion,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating edit suggestion:', error);
      throw new Error('Failed to create edit suggestion');
    }

    return data as RestaurantEditSuggestion;
  } catch (error) {
    console.error('Error in createEditSuggestion:', error);
    return null;
  }
}

/**
 * Get all edit suggestions (for admin)
 */
export async function getEditSuggestions(
  status?: EditSuggestionStatus
): Promise<RestaurantEditSuggestion[]> {
  try {
    const supabase = createClerkSupabaseClient();
    let query = supabase.from('restaurant_edit_suggestions').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching edit suggestions:', error);
      throw new Error('Failed to fetch edit suggestions');
    }

    return (data as RestaurantEditSuggestion[]) || [];
  } catch (error) {
    console.error('Error in getEditSuggestions:', error);
    return [];
  }
}

/**
 * Update suggestion status (approve/reject)
 */
export async function updateSuggestionStatus(
  id: string,
  status: EditSuggestionStatus,
  reviewedBy: string
): Promise<boolean> {
  try {
    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from('restaurant_edit_suggestions')
      .update({
        status,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating suggestion status:', error);
      throw new Error('Failed to update suggestion status');
    }

    return true;
  } catch (error) {
    console.error('Error in updateSuggestionStatus:', error);
    return false;
  }
}

/**
 * Apply approved suggestion to restaurant
 */
export async function applySuggestion(suggestionId: string): Promise<boolean> {
  try {
    const supabase = createClerkSupabaseClient();

    // Get the suggestion
    const { data: suggestion, error: fetchError } = await supabase
      .from('restaurant_edit_suggestions')
      .select('*')
      .eq('id', suggestionId)
      .single();

    if (fetchError || !suggestion) {
      throw new Error('Suggestion not found');
    }

    if (suggestion.status !== 'approved') {
      throw new Error('Suggestion is not approved');
    }

    // Update the restaurant field
    const updateData: Record<string, any> = {};
    updateData[suggestion.field_name] = suggestion.new_value;

    const { error: updateError } = await supabase
      .from('restaurants')
      .update(updateData)
      .eq('id', suggestion.restaurant_id);

    if (updateError) {
      console.error('Error applying suggestion:', updateError);
      throw new Error('Failed to apply suggestion');
    }

    return true;
  } catch (error) {
    console.error('Error in applySuggestion:', error);
    return false;
  }
}

