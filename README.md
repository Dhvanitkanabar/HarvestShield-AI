# HarvestShield AI

**Tagline**: AI-Powered Post-Harvest Decision Intelligence Platform

HarvestShield AI helps farmers, Farmer Producer Organizations (FPOs), warehouses, processors, and markets reduce post-harvest losses by predicting shelf-life, spoilage risk, market opportunities, and recommending the best action.

## 🚀 Docker Development Environment

This project is fully dockerized to ensure a consistent, seamless, and production-ready environment across all machines. The environment includes the Node.js API, PostgreSQL database, and pgAdmin GUI.

### Prerequisites

- **Docker Desktop** (or Docker Engine + Docker Compose)
- **Node.js** (v20+ recommended for local non-Docker development)
- **Git**

**Docker Installation:**
- **Windows / Mac**: Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- **Linux**: Install Docker Engine and Docker Compose plugin from the [official docs](https://docs.docker.com/engine/install/).

---

### 📦 Setup & Configuration

1. **Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   > **Note**: For Docker development, the `DATABASE_URL` in `.env` must use the Docker networking hostname (`postgres`), which is already configured in the `.env.example`.

2. **Starting the Containers**:
   To start PostgreSQL, pgAdmin, and the Node.js Backend in the background, run:
   ```bash
   docker compose up -d
   ```
   The backend will automatically start and wait for the database to become healthy. Hot-reloading is enabled, so changes you make to the source code will immediately reflect in the running container.

3. **Stopping the Containers**:
   ```bash
   docker compose down
   ```
   *(To stop and remove all data volumes, run `docker compose down -v`)*

4. **Viewing Logs**:
   To monitor the API or database logs:
   ```bash
   docker compose logs -f
   ```
   To view logs for a specific service (e.g., the API):
   ```bash
   docker compose logs -f api
   ```

---

### 🐘 Database Management

#### Connecting to pgAdmin
pgAdmin is bundled with this setup to easily visualize and manage the database.
1. Open your browser and navigate to: **[http://localhost:5050](http://localhost:5050)**
2. **Login Credentials**:
   - Email: `admin@harvestshield.ai`
   - Password: `admin123`
3. The `HarvestShield Database (Docker)` server is **auto-registered**. Expand it to view your tables. (Password is `postgres` if prompted).

#### Running Prisma Migrations
Because the backend is running inside Docker, run the Prisma migration command natively. The API container accesses the same mapped volume.
```bash
npx prisma migrate dev --name phase2_ecosystem
```
*(If running this command directly from the host, ensure your `DATABASE_URL` is temporarily set to `localhost` rather than `postgres`, OR run the command directly inside the API container like this: `docker compose exec api npx prisma migrate dev --name phase2_ecosystem`)*

#### Generating Prisma Client
```bash
npx prisma generate
```

#### Seeding the Database
To inject the mock data (Farmers, Crops, Warehouses, Markets, Processors):
```bash
npx tsx prisma/seed.ts
```
*(Or via Docker: `docker compose exec api npx tsx prisma/seed.ts`)*

---

### 🛠 Troubleshooting

- **`P1001: Can't reach database server at localhost:5432`**: 
  If you are running `npx prisma migrate dev` from your host machine (Windows/Mac) instead of inside Docker, you must change `postgres` to `localhost` in your `.env` `DATABASE_URL`. Alternatively, run migrations *inside* the container: `docker compose exec api npx prisma migrate dev`.
- **Port Conflicts**:
  If port `5432` or `5000` is already in use by another local installation, stop the local service or change the port mapping in `docker-compose.yml` (e.g., `"5433:5432"`).
- **Hot-reloading not working on Windows (WSL2)**:
  Ensure your project is located inside the WSL filesystem (e.g., `~/projects/...`) rather than the mounted Windows filesystem (`/mnt/c/...`) for optimal file-watching performance.