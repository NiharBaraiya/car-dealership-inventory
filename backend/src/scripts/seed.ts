import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db';
import { User } from '../models/User';
import { Vehicle } from '../models/Vehicle';

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@dealership.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin123456';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Admin User';

const SAMPLE_VEHICLES = [
  { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 28500, quantity: 8 },
  { make: 'Honda', model: 'Civic', category: 'Sedan', price: 24500, quantity: 6 },
  { make: 'Ford', model: 'F-150', category: 'Truck', price: 52000, quantity: 4 },
  { make: 'Tesla', model: 'Model 3', category: 'Electric', price: 42000, quantity: 3 },
  { make: 'BMW', model: 'X5', category: 'SUV', price: 65000, quantity: 2 },
  { make: 'Chevrolet', model: 'Corvette', category: 'Sports', price: 72000, quantity: 1 },
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
