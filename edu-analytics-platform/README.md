# EduAnalytics — Learning Analytics and Personalized Education Platform

A containerized platform that monitors student learning activity, predicts
academic risk, and gives students and faculty role-based dashboards.

## Architecture

- **frontend/** — React app (student & faculty dashboards)
- **backend/** — Node.js + Express REST API (auth, students, courses, alerts)
- **analytics-service/** — Python + FastAPI microservice (risk prediction, recommendations)
- **PostgreSQL** — primary data store
- **Redis** — cache / queue (reserved for future notification jobs)

## Option A — Run everything with Docker (recommended)

```bash
cp .env.example .env          # edit values if you like
docker compose build
docker compose up -d
docker compose exec backend npm run migrate   # create tables
docker compose exec backend npm run seed      # add sample data
```

Then open:
- Frontend: http://localhost:3000
- Backend health: http://localhost:5000/health
- Analytics docs: http://localhost:8000/docs

Sample logins (created by `npm run seed`):
- Faculty: `faculty@edu.test` / `Password123!`
- Student (at-risk demo): `sneha@edu.test` / `Password123!`
- Student (healthy demo): `arjun@edu.test` / `Password123!`

## Option B — Run each service locally in VS Code

**1. PostgreSQL & Redis** (quickest via Docker, or install natively):
```bash
docker run -d --name edu-postgres -p 5432:5432 \
  -e POSTGRES_DB=edu_analytics -e POSTGRES_USER=edu_admin -e POSTGRES_PASSWORD=edu_password \
  postgres:16-alpine
docker run -d --name edu-redis -p 6379:6379 redis:7-alpine
```

**2. Backend**
```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev        # nodemon, http://localhost:5000
```

**3. Analytics service**
```bash
cd analytics-service
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**4. Frontend**
```bash
cd frontend
npm install
npm start           # http://localhost:3000
```

## Project Structure

```
edu-analytics-platform/
├── backend/            Node.js + Express API
├── frontend/            React dashboards
├── analytics-service/   Python FastAPI risk engine
├── docker-compose.yml
├── .env.example
└── README.md
```

## Git Workflow

This repository follows GitFlow: `main` (production), `develop` (integration),
`feature/*`, `release/*`, `hotfix/*`. See the accompanying technical report
for the full branching diagram and commit conventions.
