"use client";

/**
 * @file page.tsx
 * @description Admin restaurants list page
 *
 * Displays all restaurants with options to add, edit, or delete.
 * Requires admin access.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRestaurants, deleteRestaurant } from "@/actions/restaurants";
import type { Restaurant } from "@/types/restaurant";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Check admin status
      const isAdmin = user.publicMetadata?.role === "admin" || 
                     user.publicMetadata?.isAdmin === true;
      if (!isAdmin) {
        router.push("/");
        return;
      }
      loadRestaurants();
    } else if (isLoaded && !user) {
      router.push("/");
    }
  }, [user, isLoaded, router]);

  async function loadRestaurants() {
    try {
      setLoading(true);
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error("Error loading restaurants:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }

    const success = await deleteRestaurant(id);
    if (success) {
      loadRestaurants();
    } else {
      alert("Failed to delete restaurant");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-background min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <Link href="/admin/restaurants/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Restaurant
          </Button>
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No restaurants found.</p>
          <Link href="/admin/restaurants/new">
            <Button>Add Your First Restaurant</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
            >
              <h3 className="font-semibold text-lg mb-2">
                {restaurant.name_en}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{restaurant.name_ko}</p>
              <p className="text-xs text-gray-500 mb-4">
                {restaurant.address_en}
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  {restaurant.category}
                </span>
                {restaurant.is_verified && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Link
                  href={`/admin/restaurants/${restaurant.id}/edit`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(restaurant.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
