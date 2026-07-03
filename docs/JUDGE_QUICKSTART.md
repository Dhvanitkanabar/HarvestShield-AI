# HarvestShield AI — Judge Quick Start Guide

> **⏱️ You can evaluate this entire platform in under 10 minutes.**

---

## Step 1: Start the Application

### Option A: With Docker (Recommended)
```bash
docker compose up -d
# Wait ~30 seconds for services to start
```

### Option B: Without Docker
```bash
# Terminal 1 — Backend
npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

---

## Step 2: Open the App

Navigate to: **http://localhost:3000**

---

## Step 3: Login as Admin

Use the demo bypass on the login page:
- **Email:** `admin@harvestshield.com`  
- **Password:** `admin`

OR use a real account if the database is seeded:
- **Email:** `admin@harvestshield.ai`
- **Password:** `admin123`

---

## Step 4: Explore These Pages in Order

### 🎯 5-Minute Evaluation Path

| # | Page | What to Look For |
|---|------|-----------------|
| 1 | **Admin Overview** | KPI cards, revenue chart, demo banner |
| 2 | **Impact Dashboard** (`/admin/impact`) | Animated metrics — food saved, CO₂, revenue |
| 3 | **Business Simulator** (`/admin/simulator`) | Move sliders, see Before vs After comparison |
| 4 | **IoT & Digital Twin** (`/admin/iot`) | Click "Simulate Temp Spike", see live WebSocket update |
| 5 | **Farmer Login** | Switch to `ramesh.farmer@harvestshield.ai / farmer123` |
| 6 | **AI Recommendations** | Expand a recommendation → see full explainability |
| 7 | **Language Switch** | Bottom of sidebar → switch to Hindi |

---

## Step 5: Test the API

Health check:
```
GET http://localhost:5000/api/v1/health
```

Demo credentials:
```
GET http://localhost:5000/api/v1/demo/credentials
```

System stats:
```
GET http://localhost:5000/api/v1/demo/stats
```

---

## All Role Credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Admin | admin@harvestshield.ai | admin123 | /dashboard/admin |
| Farmer | ramesh.farmer@harvestshield.ai | farmer123 | /dashboard/farmer |
| Farmer 2 | sunita.farmer@harvestshield.ai | farmer123 | /dashboard/farmer |
| FPO | fpo@harvestshield.ai | fpo123 | /dashboard/fpo |
| Warehouse | warehouse@harvestshield.ai | warehouse123 | /dashboard/warehouse |
| Processor | processor@harvestshield.ai | processor123 | /dashboard/processor |
| Market | market@harvestshield.ai | market123 | /dashboard/market |
| Driver | driver@harvestshield.ai | driver123 | /dashboard/driver |

---

## Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api/v1 |
| AI Service | http://localhost:8000/docs |
| pgAdmin | http://localhost:5050 |

---

## 💡 Key Innovation Points for Judges

1. **AI Explainability**: Every recommendation shows confidence, reasoning, factors, alternatives, risks — not a black box
2. **Digital Twin**: Real-time WebSocket streaming of sensor data into live entity models
3. **Business Simulator**: Interactive ROI calculator — judges can see the value proposition instantly
4. **Impact Dashboard**: Quantified social + economic impact with animated visualizations
5. **Offline PWA**: Works offline with service worker caching — critical for rural India
6. **Multilingual**: EN/HI switching in the UI; architecture supports all 22 scheduled Indian languages
7. **Clean Architecture**: Repository pattern, DI, SOLID principles throughout

---

*For questions during judging, see [PRESENTATION_PACKAGE.md](PRESENTATION_PACKAGE.md)*
