# Project ReMotion — Investigation Portal

Advanced Web Engineering Course Exercise Project (Exercises 2–6)

## Quick Start

### Frontend (Main App)
```bash
npm install
npm run dev
```
Runs on `http://localhost:5173` (Vite default)

### Backend (Development Only — Exercise 6+)
```bash
cd backend
npm install
npm start
```
Runs on `http://localhost:3001`

**The backend is dev-only and does NOT run in production.** Exercise 2's GitHub Pages deployment uses the static frontend only.

---

## Backend: Demo 4 & Beyond

The backend is a minimal Express.js server serving the case data as read-only REST endpoints.

### Endpoints

| Endpoint | Returns | Source |
|----------|---------|--------|
| `GET /api/case` | Case metadata | `public/data/case.json` |
| `GET /api/evidence` | All evidence items | `public/data/evidence.json` |
| `GET /api/people` | All people involved | `public/data/people.json` |
| `GET /api/locations` | All locations | `public/data/locations.json` |
| `GET /api/timeline` | Timeline events | `public/data/timeline.json` |
| `GET /health` | Server status | (internal) |

### Testing Features (Query Parameters)

For demonstrating loading, error, and cancellation behavior:

#### `?delay=<milliseconds>`
Introduces artificial delay before responding. Useful for testing loading states and request cancellation.

Example: `GET /api/evidence?delay=3000` — responds after 3 seconds

#### `?error=true`
Returns a 500 error instead of data. For testing error state handling.

Example: `GET /api/people?error=true` — returns `{ error: "Simulated backend error..." }`

#### Combining Parameters
Both can be used together: `GET /api/evidence?delay=2000&error=true`

### Example Requests

```bash
# Normal request
curl http://localhost:3001/api/evidence

# With 2-second delay
curl "http://localhost:3001/api/evidence?delay=2000"

# With error
curl "http://localhost:3001/api/people?error=true"

# Combined
curl "http://localhost:3001/api/case?delay=1500&error=true"
```

### Running Frontend + Backend Together (Development)

**Terminal 1** — Frontend:
```bash
npm run dev
```

**Terminal 2** — Backend:
```bash
npm run dev:backend
```

Or one-liner (if your shell supports it):
```bash
npm run dev & npm run dev:backend
```

The frontend (Vite on port 5173) will fetch from the backend (Express on port 3001). CORS is enabled.

---

## Architecture Notes

### Why a Backend?

Early exercises use static `data/*.json` files, which always load "instantly" or "fail immediately." This makes it impossible to demonstrate:
- Loading states (spinners, "Loading..." messages)
- Error handling (what happens when the request fails?)
- Request cancellation (what happens if the user navigates away before data arrives?)
- Race conditions (what if two requests overlap?)

The backend introduces **realistic network conditions**: delays, failures, and timing edge cases.

### Why Read-Only?

Bookmarks, notes, and hypothesis drafts stay in `localStorage` exactly as in Exercises 3–5. The backend only serves **reading** case data. No write endpoints, no persistence. This keeps the scope small while teaching effects, fetching, and error handling thoroughly.

### What's NOT Here

- Database (data is read from static JSON files)
- Authentication
- Write endpoints
- Deployment/production server
- Docker or containerization

---

## Exercise 6 Demos

| Demo | Task |
|------|------|
| 1 | Render logic vs. effects |
| 2 | `useEffect` mental model & dependency arrays |
| 3 | Cleanup: timers & subscriptions |
| **4** | **Build the read-only Node backend** ← You are here |
| 5 | Consume the backend from React |
| 6 | Loading, error, and empty states |
| 7 | Request races & cancellation |
| 8 | Extract a reusable custom hook |
| 9 | Separate UI, application logic, and API access |
| 10 | Data-flow wrap-up & UX decision |

---

## Troubleshooting

### Port 3001 Already in Use
```bash
# Find process on port 3001 (macOS/Linux)
lsof -i :3001

# Kill it
kill -9 <PID>

# Or use a different port
PORT=3002 npm start
```

### CORS Errors
The backend includes `cors()` middleware. If you still get errors:
1. Ensure backend is running (`npm start`)
2. Check the frontend is making requests to `http://localhost:3001/api/...`
3. Verify CORS headers are present: `curl -I http://localhost:3001/health`

### "Cannot find module 'express'"
```bash
cd backend
npm install
```

---

## Files

- `backend/server.js` — Express server with endpoints and testing controls
- `backend/package.json` — Backend dependencies (express, cors)
- `public/data/*.json` — Source data files served by the backend

---

## License

UNLICENSED (Course exercise project)
