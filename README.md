# Car Dealership Inventory System

A full-stack application for managing a car dealership's vehicle inventory. Built with **React** (frontend), **Node.js + Express + TypeScript** (backend), and **MongoDB** (database).

## Features

- User registration and JWT-based authentication
- Browse, search, and filter vehicles
- Purchase vehicles (decreases stock quantity)
- Admin: add, update, delete, and restock vehicles

## Project Structure

```
Car Dealership Inventory System/
├── backend/          # Node.js + Express + TypeScript API
├── frontend/         # React + Vite SPA
├── docker-compose.yml
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB](https://www.mongodb.com/) (local install or Docker)
- [Docker](https://www.docker.com/) (optional, for MongoDB)

## Quick Start

From the project root you can also use convenience scripts:

```bash
npm run install:all   # Install backend + frontend dependencies
npm run docker:up     # Start MongoDB via Docker
npm run seed          # Seed admin user + sample vehicles
npm run test          # Run all backend + frontend tests
```

### 1. Start MongoDB

**Option A — Docker (recommended):**

```bash
docker-compose up -d
```

**Option B — Local MongoDB:**

Ensure MongoDB is running on `mongodb+srv://NiharBaraiya:NiharBaraiya@cluster0.r98pmog.mongodb.net/car_dealership?retryWrites=true&w=majority`.

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed    # Creates admin user + sample vehicles
npm run dev
```

The API runs at `http://localhost:5000`.

**Default admin credentials:**

| Field    | Value                 |
|----------|-----------------------|
| Email    | `admin@dealership.com` |
| Password | `admin123456`          |

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | No | — | Register a new user |
| POST | `/api/auth/login` | No | — | Login and receive JWT |
| GET | `/api/vehicles` | Yes | Any | List all vehicles |
| GET | `/api/vehicles/search` | Yes | Any | Search by make, model, category, price |
| POST | `/api/vehicles` | Yes | Admin | Add a new vehicle |
| PUT | `/api/vehicles/:id` | Yes | Admin | Update a vehicle |
| DELETE | `/api/vehicles/:id` | Yes | Admin | Delete a vehicle |
| POST | `/api/vehicles/:id/purchase` | Yes | Any | Purchase a vehicle |
| POST | `/api/vehicles/:id/restock` | Yes | Admin | Restock a vehicle |

## Running Tests

### Backend

```bash
cd backend
npm test
npm run test:coverage
```

**Latest test results:** 35 tests passing across unit and integration suites (auth service, vehicle service, auth routes, vehicle routes).

See [TEST_REPORT.md](./TEST_REPORT.md) for the full test report with coverage details.

### Frontend

```bash
cd frontend
npm test
```

**Latest test results:** 8 tests passing (LoginForm, VehicleCard, VehicleSearch component tests).

### All Tests (from project root)

```bash
npm test
```

## Screenshots

![Vehicle Inventory Dashboard](./frontend/public/screenshots/dashboard.png)

![Admin Dashboard](./frontend/public/screenshots/admin.png)

## My AI Usage

### Tools Used
- **Cursor AI** – Project scaffolding, test generation, and debugging.
- **ChatGPT** – Backend/frontend implementation, migration scripts, and bug fixing.
- **Gemini (Antigravity)** – Troubleshooting MongoDB services, Atlas connectivity, and configuration issues.

### How I Used AI

- **Project Scaffolding & Initial Coding**: Used Cursor to scaffold the backend and frontend components, configure initial models, and set up test cases.
- **Database Service Troubleshooting**: Used Gemini to query the Windows services registry (`Get-Service`) to discover that the local MongoDB database service was stopped, and to troubleshoot MongoDB Atlas credential mismatches during cloud migration.
- **Data Migrations & Seeding**: Used ChatGPT to create and run specialized migration and seeding scripts (e.g., `updateSeedImages.ts` and `forceSeed.ts`) to populate the MongoDB Atlas cluster with default inventory.
- **Frontend Bugfix Resolution**: Used ChatGPT to diagnose and fix relative image path rendering by updating the image URL resolver function (`getVehicleImageUrl`) to route image requests directly to the correct backend port, excluding local blob previews.
- **Testing & Code Refinement**: Used **Cursor AI** to generate initial test cases, review implementation logic, and suggest improvements to code structure, error handling, and overall application reliability.

### Reflection

AI significantly improved my development workflow by accelerating both implementation and debugging. **Cursor AI** helped generate the initial project structure, boilerplate code, and test cases, allowing me to focus on application logic. **ChatGPT** assisted with backend and frontend implementation, migration scripts, and resolving issues related to image uploads and frontend-backend integration. **Gemini** proved valuable for diagnosing MongoDB service and Atlas connectivity problems, helping identify configuration and credential issues more efficiently. Overall, using these AI tools reduced development time, simplified troubleshooting, and enabled me to deliver a more reliable and well-tested full-stack application.

## License

MIT
