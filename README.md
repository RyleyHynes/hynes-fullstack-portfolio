# Portfolio Monorepo (React + TypeScript + C#/.NET + PostgreSQL)

## Quickstart
Open two terminals from the repo root.

### Terminal 1 — Backend (Celium API)
```bash
cd backend/Celium.Api
dotnet build
dotnet ef migrations add InitialCelium
dotnet ef database update
dotnet run
```

API docs: http://localhost:5270/swagger

### Terminal 2 — Frontend
```bash
cd frontend
npm i
npm run dev
```

Frontend: http://localhost:3000

Celium Login:  
Username: demo@celium.app  
Password: CeliumDemo123!  

## Notes
- Postgres is required locally. Install it (or at least `psql`) before running the API.
- Create a local role + database (example):
  - `psql -d postgres -c "CREATE ROLE \"Celium\" WITH LOGIN PASSWORD 'your_password';"`
  - `psql -d postgres -c "CREATE DATABASE \"Celium\" OWNER \"Celium\";"`
- Update the connection string in `backend/Celium.Api/appsettings.Development.json` with your own password:
  - `Host=localhost;Port=5432;Database=Celium;Username=Celium;Password=your_password`
- If you already have migrations, skip the `dotnet ef migrations add ...` step and just run `dotnet ef database update`.
