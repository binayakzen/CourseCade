# CourseCade ⚡

CourseCade is an advanced, gamified web learning platform featuring interactive coding courses, real-time study peers, AI anti-cheat monitoring telemetry, and automated token mining rewards.

## Version 3.0 Highlights
- **Sleek 3-Folder Architecture:** Clean organization separating Next.js App Router (`app/`), static assets (`public/`), and core logic (`src/`).
- **Precision Telemetry Engine:** Live heartbeat monitoring calibrated to exact playback deltas with high-water mark protection against re-watch token farming.
- **Robust Storage Auto-Sanitization:** Self-healing client progress trackers that automatically resolve numerical anomalies.
- **Full AWS Aurora PostgreSQL Integration:** Drizzle ORM schemas backed by live cloud persistence.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file with your database credentials:
```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/postgres
```

### 3. Run Locally
```bash
npm run dev
```
