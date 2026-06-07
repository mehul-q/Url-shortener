# URL Shortener

A clean, fast, full stack URL shortener built with React, Node.js, PostgreSQL and Redis. No login required — paste a long URL and get a short link instantly.

![URL Shortener](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

---

## Live Demo

> [https://url-shortener-flame-phi.vercel.app/]

---

## Features

- Shorten any URL instantly — no signup needed
- Custom alias support (e.g. `short.ly/my-link`)
- Link expiry support
- Redis caching for fast redirects
- Rate limiting to prevent abuse
- Clean, responsive UI

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React, Vite             |
| Backend    | Node.js, Express        |
| Database   | PostgreSQL              |
| Cache      | Redis                   |
| Algorithm  | Base62 encoding         |
| Deployment | Vercel + Railway        |

---

## How it Works

1. User pastes a long URL → `POST /api/shorten`
2. Server inserts a row in PostgreSQL → gets auto-increment ID
3. ID is encoded to Base62 (e.g. `1000` → `"qi"`) → becomes the short code
4. Short code + original URL is cached in Redis
5. When someone visits the short link → `GET /:code`
6. Server checks Redis first (fast path) → falls back to PostgreSQL on miss
7. Redirects to original URL with `301`

---

## Project Structure

```
url-shortener/
├── client/                      # React frontend
│   ├── src/
│   │   ├── api/index.js         # Axios API client
│   │   ├── components/
│   │   │   ├── ShortenForm.jsx  # URL input form
│   │   │   └── UrlCard.jsx      # Result with copy button
│   │   ├── App.jsx
│   │   └── App.css
│   └── .env
│
├── server/                      # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   │   └── urlController.js # shorten + redirect logic
│   │   ├── routes/
│   │   │   └── urlRoutes.js
│   │   ├── services/
│   │   │   ├── base62.js        # encode / decode algorithm
│   │   │   ├── cache.js         # Redis get / set / rate limit
│   │   │   └── db.js            # PostgreSQL pool
│   │   ├── schema.sql
│   │   └── app.js
│   └── .env
│
└── docker-compose.yml
```

---

## API Endpoints

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/shorten`       | Create a short URL       |
| GET    | `/:code`             | Redirect to original URL |

### POST `/api/shorten`

**Request body:**
```json
{
  "originalUrl": "https://very-long-url.com/path",
  "customAlias": "my-link",
  "expiresIn": 86400
}
```

**Response:**
```json
{
  "shortUrl": "http://localhost:5000/my-link",
  "shortCode": "my-link"
}
```

---

## Run Locally

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Docker Desktop](https://docker.com/products/docker-desktop)
- [Git](https://git-scm.com)

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener
```

**2. Install dependencies**
```bash
cd server && npm install
cd ../client && npm install
```

**3. Set up environment variables**

`server/.env`
```env
DATABASE_URL=postgresql://user:password@localhost:5432/urlshortener
REDIS_URL=redis://localhost:6379
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
PORT=5000
```

`client/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_BASE_URL=http://localhost:5000
```

**4. Start databases**
```bash
cd ..
docker-compose up -d
```

**5. Run database migration (first time only)**
```bash
docker exec -i url-shortener-postgres-1 psql -U user -d urlshortener < server/src/schema.sql
```

**6. Start backend (Terminal 1)**
```bash
cd server && npm run dev
```

**7. Start frontend (Terminal 2)**
```bash
cd client && npm run dev
```

**8. Open browser**
```
http://localhost:5173
```

---

## Deployment

- **Frontend** → [Vercel](https://vercel.com) — connect GitHub repo, set root to `client/`
- **Backend + DB** → [Railway](https://railway.app) — connect GitHub repo, set root to `server/`, add PostgreSQL and Redis services

---

## Key Concepts Demonstrated

- **Base62 encoding** — converts PostgreSQL auto-increment ID into a short alphanumeric code, guaranteeing uniqueness without collision checks
- **Redis caching** — redirect path checks Redis before PostgreSQL, reducing DB load under high traffic
- **Rate limiting** — IP-based sliding window using Redis prevents abuse on the shorten endpoint
- **Async analytics** — click logging runs in the background without blocking the redirect response

---

## License

MIT