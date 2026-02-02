# Celium API

Minimal .NET 8 Web API for the Celium portfolio app. Endpoints are currently unversioned and treated as v1 for the demo.

## Versioning strategy
The demo treats current routes as v1. When versioning is introduced, it will use URL versioning (`/api/v1/...`) to keep contracts explicit without breaking existing clients.

## OpenAPI
Swagger/OpenAPI is enabled in development. The schema lives at:

`/swagger/v1/swagger.json`

The in-app docs consume this JSON in `frontend/src/celium/ApiDocs.tsx`.

## Authentication (Auth0 + RBAC)
Celium uses Auth0 (OIDC) with JWT bearer tokens. Configure these settings in `appsettings.Development.json`:

- `Auth0:Domain` (ex: `your-tenant.us.auth0.com`)
- `Auth0:Audience` (API identifier from Auth0)
- `Auth0:RoleClaim` (defaults to `https://celium.app/roles`)

Write endpoints require the `routes:write` permission (or `Admin` role). Assign `routes:write` in Auth0 by enabling RBAC + "Add Permissions in the Access Token" for your API.

### Recommended setup (real-world)
1) Create an Auth0 API called `celium-api`.
2) Add permissions: `routes:read`, `routes:create`, `routes:update`, `routes:delete`.
3) Create roles:
   - `Admin` → all permissions
   - `Member` → `routes:read`
4) Create two test users and assign roles (Admin + Member).
5) Enable "Add Permissions in the Access Token" in Auth0 API settings.
6) Set `Auth0:Domain` and `Auth0:Audience` locally.

### Validate claims
Use `GET /me` (requires a token) to inspect roles + permissions.

## Endpoints (v1)
- `GET /routes`
- `GET /routes/{id}`
- `POST /routes`
- `PUT /routes/{id}`
- `DELETE /routes/{id}`

## Notes
- CORS allows `http://localhost:3000` for local development.
- Climbing fields (`ClimbingStyle`, `ClimbingGrade`) and `Progress` require a migration on existing databases.
