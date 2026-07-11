import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db';
import { User } from '../models/User';
import { Vehicle } from '../models/Vehicle';

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@dealership.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin123456';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Admin User';

const SAMPLE_VEHICLES = [
  {
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    year: 2024,
    price: 28500,
    quantity: 8,
    description: 'Reliable midsize sedan with excellent fuel economy and advanced safety features.',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c7054e1f2?w=800&q=80',
  },
  {
    make: 'Honda',
    model: 'Civic',
    category: 'Sedan',
    year: 2024,
    price: 24500,
    quantity: 6,
    description: 'Sporty compact sedan known for reliability, efficiency, and a refined driving experience.',
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
  },
  {
    make: 'Ford',
    model: 'F-150',
    category: 'Truck',
    year: 2023,
    price: 52000,
    quantity: 4,
    description: 'America\'s best-selling truck with powerful towing capacity and rugged capability.',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
  },
  {
    make: 'Tesla',
    model: 'Model 3',
    category: 'Electric',
    year: 2024,
    price: 42000,
    quantity: 3,
    description: 'Premium electric sedan with cutting-edge autopilot and zero emissions performance.',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
  },
  {
    make: 'BMW',
    model: 'X5',
    category: 'SUV',
    year: 2023,
    price: 65000,
    quantity: 2,
    description: 'Luxury midsize SUV combining sporty handling with premium comfort and technology.',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  },
  {
    make: 'Chevrolet',
    model: 'Corvette',
    category: 'Sports',
    year: 2024,
    price: 72000,
    quantity: 1,
    description: 'Iconic American sports car with breathtaking performance and head-turning design.',
    imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
  },
];

async function seed() {
  await connectDB();

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
  } else {
    await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: ADMIN_NAME,
      role: 'admin',
    });
    console.log(`Created admin user: ${ADMIN_EMAIL}`);
  }

  const vehicleCount = await Vehicle.countDocuments();
  if (vehicleCount > 0) {
    console.log(`Skipping vehicle seed — ${vehicleCount} vehicle(s) already in database`);
  } else {
    await Vehicle.insertMany(SAMPLE_VEHICLES);
    console.log(`Seeded ${SAMPLE_VEHICLES.length} sample vehicles`);
  }

  console.log('\nSeed complete. Admin credentials:');
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);

  await disconnectDB();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
