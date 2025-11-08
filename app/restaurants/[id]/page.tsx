import { notFound } from 'next/navigation';
import { getRestaurantById } from '@/actions/restaurants';
import { RestaurantDetailView } from '@/components/restaurants/restaurant-detail-view';
import { getLanguage } from '@/lib/i18n';

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const restaurant = await getRestaurantById(resolvedParams.id);
  const language = getLanguage();

  if (!restaurant) {
    notFound();
  }

  return <RestaurantDetailView restaurant={restaurant} initialLanguage={language} />;
}

