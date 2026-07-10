# Test Report — Car Dealership Inventory System

**Generated:** July 11, 2026  
**Environment:** Node.js, Windows 10

## Summary

| Suite | Test Files | Tests | Status |
|-------|------------|-------|--------|
| Backend (Jest) | 4 | 35 | ✅ All passing |
| Frontend (Vitest) | 3 | 8 | ✅ All passing |
| **Total** | **7** | **43** | **✅ All passing** |

---

## Backend Tests

### Unit Tests

#### `tests/unit/auth.service.test.ts`
- Registers a new user with hashed password
- Rejects duplicate email registration
- Logs in with valid credentials and returns JWT
- Rejects invalid password
- Rejects non-existent user

#### `tests/unit/vehicle.service.test.ts`
- Creates a vehicle with all required fields
- Returns all vehicles sorted by creation date
- Searches vehicles by make (case-insensitive)
- Searches vehicles by price range
- Updates vehicle details
- Deletes a vehicle
- Purchases a vehicle and decrements quantity
- Rejects purchase when out of stock
- Restocks a vehicle and increments quantity

### Integration Tests

#### `tests/integration/auth.routes.test.ts`
- `POST /api/auth/register` — creates user (201)
- `POST /api/auth/register` — rejects invalid email (400)
- `POST /api/auth/register` — rejects duplicate email (409)
- `POST /api/auth/login` — returns token (200)
- `POST /api/auth/login` — rejects wrong password (401)

#### `tests/integration/vehicle.routes.test.ts`
- `GET /api/vehicles` — returns list for authenticated user (200)
- `GET /api/vehicles` — rejects unauthenticated request (401)
- `POST /api/vehicles` — admin can create vehicle (201)
- `POST /api/vehicles` — non-admin rejected (403)
- `GET /api/vehicles/search` — filters by make
- `GET /api/vehicles/search` — filters by price range
- `PUT /api/vehicles/:id` — admin can update (200)
- `PUT /api/vehicles/:id` — non-admin rejected (403)
- `POST /api/vehicles/:id/purchase` — decrements stock (200)
- `POST /api/vehicles/:id/purchase` — rejects out-of-stock (400)
- `POST /api/vehicles/:id/restock` — admin can restock (200)
- `POST /api/vehicles/:id/restock` — non-admin rejected (403)
- `DELETE /api/vehicles/:id` — admin can delete (200)
- `DELETE /api/vehicles/:id` — non-admin rejected (403)

### Backend Coverage

```
-------------------------|---------|----------|---------|---------|
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files                |   94.73 |    84.21 |     100 |   94.44 |
 controllers             |     100 |      100 |     100 |     100 |
 middleware              |    92.1 |      100 |     100 |   91.17 |
 models                  |     100 |      100 |     100 |     100 |
 routes                  |     100 |      100 |     100 |     100 |
 services                |    92.3 |    76.47 |     100 |    92.3 |
 validators              |     100 |      100 |     100 |     100 |
-------------------------|---------|----------|---------|---------|
```

Run coverage locally:

```bash
cd backend
npm run test:coverage
```

---

## Frontend Tests

### Component Tests

#### `src/test/LoginForm.test.tsx`
- Renders email and password fields
- Submits credentials and navigates on success

#### `src/test/VehicleCard.test.tsx`
- Renders vehicle make, model, price, and quantity
- Shows "Out of Stock" when quantity is zero
- Disables Purchase button when out of stock
- Calls onPurchase when Purchase is clicked

#### `src/test/VehicleSearch.test.tsx`
- Renders search filter fields
- Calls onSearch with filter values on submit

Run frontend tests locally:

```bash
cd frontend
npm test
```

---

## How to Reproduce

```bash
# Backend
cd backend
npm install
npm test
npm run test:coverage

# Frontend
cd frontend
npm install
npm test
```
