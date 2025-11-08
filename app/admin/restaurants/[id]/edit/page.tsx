'use client';

/**
 * @file page.tsx
 * @description Admin edit restaurant page
 *
 * Form to edit an existing restaurant.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getRestaurantById, updateRestaurant } from '@/actions/restaurants';
import type { Restaurant } from '@/types/restaurant';

const restaurantSchema = z.object({
  name_en: z.string().min(1, 'English name is required'),
  name_ko: z.string().min(1, 'Korean name is required'),
  category: z.enum(['vegetarian', 'vegan', 'vegetarian-friendly']),
  address_en: z.string().min(1, 'English address is required'),
  address_ko: z.string().min(1, 'Korean address is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  price_range: z.enum(['budget', 'mid-range', 'upscale']).optional().nullable(),
  description_en: z.string().optional().nullable(),
  description_ko: z.string().optional().nullable(),
  naver_place_id: z.string().optional().nullable(),
  offers_side_dish_only: z.boolean().default(false),
  ordering_tips_en: z.string().optional().nullable(),
  ordering_tips_ko: z.string().optional().nullable(),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

export default function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string>('');

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setRestaurantId(resolvedParams.id);
      loadRestaurant(resolvedParams.id);
    }
    loadParams();
  }, [params]);

  async function loadRestaurant(id: string) {
    try {
      setLoading(true);
      const data = await getRestaurantById(id);
      if (data) {
        setRestaurant(data);
        // Set form values
        reset({
          name_en: data.name_en,
          name_ko: data.name_ko,
          category: data.category,
          address_en: data.address_en,
          address_ko: data.address_ko,
          latitude: data.latitude,
          longitude: data.longitude,
          price_range: data.price_range || null,
          description_en: data.description_en || null,
          description_ko: data.description_ko || null,
          naver_place_id: data.naver_place_id || null,
          offers_side_dish_only: data.offers_side_dish_only,
          ordering_tips_en: data.ordering_tips_en || null,
          ordering_tips_ko: data.ordering_tips_ko || null,
        });
      }
    } catch (error) {
      console.error('Error loading restaurant:', error);
    } finally {
      setLoading(false);
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
  });

  const onSubmit = async (data: RestaurantFormData) => {
    if (!restaurantId) return;

    try {
      setSubmitting(true);
      const updated = await updateRestaurant(restaurantId, {
        ...data,
        price_range: data.price_range || null,
        description_en: data.description_en || null,
        description_ko: data.description_ko || null,
        naver_place_id: data.naver_place_id || null,
        ordering_tips_en: data.ordering_tips_en || null,
        ordering_tips_ko: data.ordering_tips_ko || null,
      });

      if (updated) {
        router.push('/admin/restaurants');
      } else {
        alert('Failed to update restaurant');
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('Failed to update restaurant');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading restaurant...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto p-6">
        <p>Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Restaurant</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <div>
            <Label htmlFor="name_en">English Name *</Label>
            <Input id="name_en" {...register('name_en')} />
            {errors.name_en && (
              <p className="text-sm text-red-500 mt-1">{errors.name_en.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="name_ko">Korean Name *</Label>
            <Input id="name_ko" {...register('name_ko')} />
            {errors.name_ko && (
              <p className="text-sm text-red-500 mt-1">{errors.name_ko.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              {...register('category')}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian-friendly">Vegetarian-Friendly</option>
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Address</h2>

          <div>
            <Label htmlFor="address_en">English Address *</Label>
            <Input id="address_en" {...register('address_en')} />
            {errors.address_en && (
              <p className="text-sm text-red-500 mt-1">{errors.address_en.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address_ko">Korean Address *</Label>
            <Input id="address_ko" {...register('address_ko')} />
            {errors.address_ko && (
              <p className="text-sm text-red-500 mt-1">{errors.address_ko.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                {...register('latitude', { valueAsNumber: true })}
              />
              {errors.latitude && (
                <p className="text-sm text-red-500 mt-1">{errors.latitude.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                {...register('longitude', { valueAsNumber: true })}
              />
              {errors.longitude && (
                <p className="text-sm text-red-500 mt-1">{errors.longitude.message}</p>
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
              {...register('price_range')}
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
            <Textarea id="description_en" {...register('description_en')} rows={3} />
          </div>

          <div>
            <Label htmlFor="description_ko">Korean Description</Label>
            <Textarea id="description_ko" {...register('description_ko')} rows={3} />
          </div>

          <div>
            <Label htmlFor="naver_place_id">Naver Place ID</Label>
            <Input id="naver_place_id" {...register('naver_place_id')} />
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
              {...register('offers_side_dish_only')}
              className="w-4 h-4"
            />
            <Label htmlFor="offers_side_dish_only" className="cursor-pointer">
              Offers Side-Dish-Only Orders
            </Label>
          </div>

          <div>
            <Label htmlFor="ordering_tips_en">English Ordering Tips</Label>
            <Textarea id="ordering_tips_en" {...register('ordering_tips_en')} rows={2} />
          </div>

          <div>
            <Label htmlFor="ordering_tips_ko">Korean Ordering Tips</Label>
            <Textarea id="ordering_tips_ko" {...register('ordering_tips_ko')} rows={2} />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Restaurant'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

