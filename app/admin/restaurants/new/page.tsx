"use client";

/**
 * @file page.tsx
 * @description Admin new restaurant page
 *
 * Form to create a new restaurant with all required fields.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createRestaurant } from "@/actions/restaurants";

const restaurantSchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_ko: z.string().min(1, "Korean name is required"),
  category: z.enum(["vegetarian", "vegan", "vegetarian-friendly"]),
  address_en: z.string().min(1, "English address is required"),
  address_ko: z.string().min(1, "Korean address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  price_range: z.enum(["budget", "mid-range", "upscale"]).optional(),
  description_en: z.string().optional(),
  description_ko: z.string().optional(),
  naver_place_id: z.string().optional(),
  offers_side_dish_only: z.boolean().default(false),
  ordering_tips_en: z.string().optional(),
  ordering_tips_ko: z.string().optional(),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

export default function NewRestaurantPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      offers_side_dish_only: false,
    },
  });

  const onSubmit = async (data: RestaurantFormData) => {
    try {
      setSubmitting(true);
      const restaurant = await createRestaurant({
        ...data,
        menu_items: null,
        operating_hours: null,
        is_verified: false,
      } as Parameters<typeof createRestaurant>[0]);

      if (restaurant) {
        router.push("/admin/restaurants");
      } else {
        alert("Failed to create restaurant");
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
      alert("Failed to create restaurant");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Restaurant</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <div>
            <Label htmlFor="name_en">English Name *</Label>
            <Input id="name_en" {...register("name_en")} />
            {errors.name_en && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name_en.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="name_ko">Korean Name *</Label>
            <Input id="name_ko" {...register("name_ko")} />
            {errors.name_ko && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name_ko.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              {...register("category")}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian-friendly">Vegetarian-Friendly</option>
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Address</h2>

          <div>
            <Label htmlFor="address_en">English Address *</Label>
            <Input id="address_en" {...register("address_en")} />
            {errors.address_en && (
              <p className="text-sm text-red-500 mt-1">
                {errors.address_en.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address_ko">Korean Address *</Label>
            <Input id="address_ko" {...register("address_ko")} />
            {errors.address_ko && (
              <p className="text-sm text-red-500 mt-1">
                {errors.address_ko.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                {...register("latitude", { valueAsNumber: true })}
              />
              {errors.latitude && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.latitude.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                {...register("longitude", { valueAsNumber: true })}
              />
              {errors.longitude && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.longitude.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Additional Information</h2>

          <div>
            <Label htmlFor="price_range">Price Range</Label>
            <select
              id="price_range"
              {...register("price_range")}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select...</option>
              <option value="budget">Budget-Friendly</option>
              <option value="mid-range">Mid-Range</option>
              <option value="upscale">Upscale</option>
            </select>
          </div>

          <div>
            <Label htmlFor="description_en">English Description</Label>
            <Textarea
              id="description_en"
              {...register("description_en")}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="description_ko">Korean Description</Label>
            <Textarea
              id="description_ko"
              {...register("description_ko")}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="naver_place_id">Naver Place ID</Label>
            <Input id="naver_place_id" {...register("naver_place_id")} />
            <p className="text-xs text-gray-500 mt-1">
              Optional: For fetching Naver reviews
            </p>
          </div>
        </div>

        {/* Ordering Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Ordering Information</h2>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="offers_side_dish_only"
              {...register("offers_side_dish_only")}
              className="w-4 h-4"
            />
            <Label htmlFor="offers_side_dish_only" className="cursor-pointer">
              Offers Side-Dish-Only Orders
            </Label>
          </div>

          <div>
            <Label htmlFor="ordering_tips_en">English Ordering Tips</Label>
            <Textarea
              id="ordering_tips_en"
              {...register("ordering_tips_en")}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="ordering_tips_ko">Korean Ordering Tips</Label>
            <Textarea
              id="ordering_tips_ko"
              {...register("ordering_tips_ko")}
              rows={2}
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Restaurant"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
