'use client';

/**
 * @file page.tsx
 * @description Admin suggestions moderation page
 *
 * Displays pending edit suggestions for admin review and approval.
 */

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEditSuggestions, updateSuggestionStatus, applySuggestion } from '@/actions/suggestions';
import type { RestaurantEditSuggestion } from '@/types/restaurant';

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<RestaurantEditSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  useEffect(() => {
    loadSuggestions();
  }, [filter]);

  async function loadSuggestions() {
    try {
      setLoading(true);
      const data = await getEditSuggestions(filter === 'all' ? undefined : filter);
      setSuggestions(data);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(suggestion: RestaurantEditSuggestion) {
    // TODO: Get current user ID from Clerk
    const reviewedBy = 'admin-user-id'; // Replace with actual user ID

    const success = await updateSuggestionStatus(suggestion.id, 'approved', reviewedBy);
    if (success) {
      // Apply the suggestion to the restaurant
      await applySuggestion(suggestion.id);
      loadSuggestions();
    } else {
      alert('Failed to approve suggestion');
    }
  }

  async function handleReject(suggestion: RestaurantEditSuggestion) {
    // TODO: Get current user ID from Clerk
    const reviewedBy = 'admin-user-id'; // Replace with actual user ID

    const success = await updateSuggestionStatus(suggestion.id, 'rejected', reviewedBy);
    if (success) {
      loadSuggestions();
    } else {
      alert('Failed to reject suggestion');
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading suggestions...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Suggestions</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('approved')}
          >
            Approved
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No suggestions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      Restaurant ID: {suggestion.restaurant_id.substring(0, 8)}...
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        suggestion.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : suggestion.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {suggestion.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Field: </span>
                      <span>{suggestion.field_name}</span>
                    </div>
                    {suggestion.old_value && (
                      <div>
                        <span className="font-medium">Old Value: </span>
                        <span className="text-red-600 line-through">{suggestion.old_value}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">New Value: </span>
                      <span className="text-green-600">{suggestion.new_value}</span>
                    </div>
                  </div>
                </div>
              </div>

              {suggestion.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleApprove(suggestion)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(suggestion)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              {suggestion.reviewed_at && (
                <p className="text-xs text-gray-500 mt-2">
                  Reviewed on: {new Date(suggestion.reviewed_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

