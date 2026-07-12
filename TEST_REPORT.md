# Test Report — Car Dealership Inventory System

**Generated:** July 12, 2026  
**Environment:** Node.js, Windows 11 / Windows 10

## Summary

| Suite | Test Files | Tests | Status |
|-------|------------|-------|--------|
| Backend (Jest) | 7 | 51 | ✅ All passing |
| Frontend (Vitest) | 6 | 20 | ✅ All passing |
| **Total** | **13** | **71** | **✅ All passing** |

---

## Backend Tests

### Unit Tests

#### `tests/unit/auth.middleware.test.ts`
- Authenticates a valid token and calls next
- Calls next with 401 error if authorization header is missing
- Calls next with 401 error if authorization header does not start with Bearer
- Calls next with 401 error if verifyToken throws
- Allows access if user is admin (`requireAdmin`)
- Denies access (403) if user is not admin (`requireAdmin`)
- Denies access (403) if req.user is undefined (`requireAdmin`)

#### `tests/unit/auth.service.test.ts`
- Registers a new user with hashed password
- Rejects duplicate email registration
- Logs in with valid credentials and returns JWT
- Rejects invalid password
- Rejects non-existent user

#### `tests/unit/validate.middleware.test.ts`
- Calls next if validationResult has no errors (`validate`)
- Calls next with AppError 400 if validationResult has errors (`validate`)
- Handles AppError and returns error details (`errorHandler`)
- Handles generic Error, logs it, and returns 500 Internal server error (`errorHandler`)

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

#### `tests/integration/upload.routes.test.ts`
- `POST /api/upload/image` — allows admin to upload a valid image (200)
- `POST /api/upload/image` — returns 400 if no image file is provided
- `POST /api/upload/image` — denies upload from regular user (403)
- `POST /api/upload/image` — denies upload from unauthenticated request (401)
- `POST /api/upload/image` — returns error for invalid file extensions (500)

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

---

## Frontend Tests

### Component Tests

#### `src/test/LoginForm.test.tsx`
- Renders email and password fields
- Submits credentials and navigates on success

#### `src/test/RegisterForm.test.tsx`
- Submits registration details and navigates to home on success
- Shows error message on failed registration

#### `src/test/VehicleCard.test.tsx`
- Renders vehicle make, model, price, and quantity
- Shows "Out of Stock" when quantity is zero
- Disables Purchase button when out of stock
- Calls onPurchase when Purchase is clicked

#### `src/test/VehicleSearch.test.tsx`
- Renders search filter fields
- Calls onSearch with filter values on submit

#### `src/test/VehicleStats.test.tsx`
- Renders correct inventory stats from vehicle array

#### `src/test/vehicleUtils.test.tsx`
- formats numbers into USD currency format without cents (`formatPrice`)
- returns the placeholder image when no image URL is provided (`getVehicleImageUrl`)
- returns the URL as-is if it is an external URL, blob link, or data URL (`getVehicleImageUrl`)
- appends relative imageUrl paths to the backend API URL (`getVehicleImageUrl`)
- sorts vehicles by price ascending (`sortVehicles`)
- sorts vehicles by price descending (`sortVehicles`)
- sorts vehicles by name (make model) alphabetically (`sortVehicles`)
- sorts vehicles by newest creation date first (`sortVehicles`)
- correctly calculates vehicle metrics from inventory array (`getVehicleStats`)

---

## How to Reproduce

### Frontend

```bash
cd frontend
npm install
npm test
```

### Backend

> [!IMPORTANT]
> Since local MongoDB memory server (`mongodb-memory-server`) requires preallocating journal space and the local `C:` drive has extremely limited space (~60MB free), it is recommended to redirect the Node.js temporary directory to another drive (such as `D:` or `E:`) when running backend tests.

**Run on PowerShell (Windows):**
```powershell
$env:TEMP="D:\temp"; $env:TMP="D:\temp"; npm test --prefix backend
```

**Or directly inside backend directory:**
```powershell
cd backend
$env:TEMP="D:\temp"; $env:TMP="D:\temp"; npm test
$env:TEMP="D:\temp"; $env:TMP="D:\temp"; npm run test:coverage
```
