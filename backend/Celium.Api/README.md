# Celium API

Minimal .NET 8 Web API for the Celium portfolio app. Endpoints are currently unversioned and treated as v1 for the demo.

## Versioning strategy
The demo treats current routes as v1. When versioning is introduced, it will use URL versioning (`/api/v1/...`) to keep contracts explicit without breaking existing clients.

## OpenAPI
Swagger/OpenAPI is enabled in development. The schema lives at:

`/swagger/v1/swagger.json`

The in-app docs consume this JSON in `frontend/src/celium/ApiDocs.tsx`.

## Endpoints (v1)
- `GET /routes`
- `GET /routes/{id}`
- `POST /routes`
- `PUT /routes/{id}`
- `DELETE /routes/{id}`

## Notes
- CORS allows `http://localhost:3000` for local development.
- Climbing fields (`ClimbingStyle`, `ClimbingGrade`) and `Progress` require a migration on existing databases.
