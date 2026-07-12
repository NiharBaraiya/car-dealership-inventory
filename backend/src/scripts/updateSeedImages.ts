import { connectDB, disconnectDB } from '../config/db';
import { Vehicle } from '../models/Vehicle';

const SEED_UPDATES = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c7054e1f2?w=800&q=80',
  },
  {
    make: 'Honda',
    model: 'Civic',
    year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
  },
  {
    make: 'Ford',
    model: 'F-150',
    year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
  },
  {
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
  },
  {
    make: 'BMW',
    model: 'X5',
    year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  },
  {
    make: 'Chevrolet',
    model: 'Corvette',
    year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
  },
];

async function updateSeedImages() {
  await connectDB();
  console.log('Connected to MongoDB.');

  for (const update of SEED_UPDATES) {
    const result = await Vehicle.updateOne(
      { make: update.make, model: update.model },
      { $set: { year: update.year, imageUrl: update.imageUrl } }
    );
    console.log(`Updated ${update.make} ${update.model}: matched=${result.matchedCount}, modified=${result.modifiedCount}`);
  }

  console.log('Database update completed.');
  await disconnectDB();
}

updateSeedImages().catch((error) => {
  console.error('Update failed:', error);
  process.exit(1);
});
