import { API_URL } from './constants';

export const VEHICLE_CATEGORIES = [
  'Sedan',
  'SUV',
  'Truck',
  'Electric',
  'Sports',
  'Coupe',
  'Hatchback',
  'Luxury',
] as const;

export const PLACEHOLDER_IMAGE = '/placeholder-car.svg';

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

export const getVehicleImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return PLACEHOLDER_IMAGE;
  if (imageUrl.startsWith('http') || imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  const baseUrl = API_URL.replace(/\/api$/, '');
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${baseUrl}${cleanPath}`;
};

export const sortVehicles = (
  vehicles: import('../types').Vehicle[],
  sort: import('../types').SortOption
) => {
  const sorted = [...vehicles];

  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) =>
        `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)
      );
    case 'newest':
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
};

export const getVehicleStats = (vehicles: import('../types').Vehicle[]) => {
  const inStock = vehicles.filter((v) => v.quantity > 0).length;
  const outOfStock = vehicles.length - inStock;
  const totalUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const totalValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const categories = new Set(vehicles.map((v) => v.category)).size;

  return { total: vehicles.length, inStock, outOfStock, totalUnits, totalValue, categories };
};
