# Ryley Hynes — Software Engineering Portfolio

A React + TypeScript portfolio with frontend (Vite + Tailwind) and backend (.NET 8 + PostgreSQL) including Celium app features.

## Project layout
- `/frontend`: React app with Auth0 and Celium UI
- `/backend/Celium.Api`: .NET 8 API for route CRUD and Auth0 bearer auth
- `/README.md`: this consolidated docs file

## Fullstack Quick Start

### Clone
```bash
git clone https://github.com/RyleyHynes/hynes-portfolio-static.git
cd hynes-portfolio-static
```

### Backend setup
```bash
cd backend/Celium.Api
```

1. Install .NET SDK 8 and PostgreSQL.
2. Configure PostgreSQL:
```bash
psql -d postgres -c "CREATE ROLE \"Celium\" WITH LOGIN PASSWORD 'your_password';"
psql -d postgres -c "CREATE DATABASE \"Celium\" OWNER \"Celium\";"
```
3. Update `backend/Celium.Api/appsettings.Development.json`:
```ini
Host=localhost;Port=5432;Database=Celium;Username=Celium;Password=your_password
```
4. Run migrations:
```bash
dotnet build
dotnet ef database update
```
5. Configure Auth0 in `appsettings.Development.json`:
```json
"Auth0": {
  "Domain": "your-tenant.us.auth0.com",
  "Audience": "https://api.celium.dev",
  "RoleClaim": "https://celium.app/roles"
}
```
6. Run:
```bash
dotnet run
```

Swagger: `https://localhost:5270/swagger`
OpenAPI JSON: `https://localhost:5270/swagger/v1/swagger.json`

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Open: `http://localhost:3000`

### Required environment variables

#### Backend (`backend/Celium.Api/appsettings.Development.json`)
- `ConnectionStrings:Default`: `Host=localhost;Port=5432;Database=Celium;Username=Celium;Password=your_password`
- `Auth0:Domain`: `your-tenant.us.auth0.com`
- `Auth0:Audience`: `https://api.celium.dev`
- `Auth0:RoleClaim`: `https://celium.app/roles` (optional)

#### Frontend (`frontend/.env.local` or env mode)
- `VITE_AUTH0_DOMAIN`: `your-tenant.us.auth0.com`
- `VITE_AUTH0_CLIENT_ID`: Auth0 SPA client id
- `VITE_AUTH0_AUDIENCE`: `https://api.celium.dev`
- `VITE_CELIUM_API_URL`: `http://localhost:5270`

### Celium demo flow
1. Click `Celium` tab.
2. Click `Launch Selenium`.
3. Sign in as demo user:
   - username: `demo@example.com`
   - password: `DemoPassword123!`
4. Member role = read-only (create/edit/delete hidden).

### Run tests
```bash
cd frontend
npm test
npm run test:coverage
npm run coverage:serve

cd ../backend/Celium.Api
dotnet test --no-restore
```

## Celium API details

### Endpoints
- `GET /routes`
- `GET /routes/{id}`
- `POST /routes`
- `PUT /routes/{id}`
- `DELETE /routes/{id}`
- `GET /users/me`

### Auth policy
- Auth0 JWT bearer
- `routes:write` policy accepts:
  - permissions: `routes:write`, `routes:*`, `routes:create`, `routes:update`, `routes:delete`
  - or role `Admin`
- 401/403 return JSON with diagnostics (including `roles`, `permissions`).

### CORS
- allows `http://localhost:3000`

### Climbing route model
- `ActivityType` includes `RockClimbing`
- Climbing style/grade fields supported

## Post-cleanup
- Deleted `frontend/README.md` (single canonical README)

## Verification checklist
- [x] `dotnet build`
- [x] `npm run dev`
- [x] `GET /users/me` returns roles/permissions
- [x] permission-driven UI: read-only hides editing

