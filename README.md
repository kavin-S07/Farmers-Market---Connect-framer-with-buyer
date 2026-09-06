# 🌾 Farmer & Buyer Marketplace

A full-stack web application that connects **farmers** directly with **buyers**, cutting out middlemen in the agricultural supply chain. Farmers can list produce for sale, and buyers can browse, order, and track purchases — all secured with JWT-based authentication and role-based access control.

**Live stack:** Spring Boot (REST API) + React (SPA) + PostgreSQL (Neon)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running with Docker](#running-with-docker)
- [Deployment](#deployment)
- [Security Notes & Recommendations](#security-notes--recommendations)
- [Known Limitations](#known-limitations)
- [Roadmap Ideas](#roadmap-ideas)
- [License](#license)

---

## Overview

This is a two-sided marketplace ("agri-tech" style) with two user roles:

- **Farmer** — lists products, manages inventory, and processes incoming orders.
- **Buyer** — browses the product catalog, places orders, and tracks order status.

The backend is a stateless REST API built with **Spring Boot 3.5** and secured with **JWT** tokens. The frontend is a **React 18** single-page application that consumes this API via Axios. Data is persisted in **PostgreSQL** (hosted on Neon in the current configuration).

---

## Key Features

### For Farmers
- Sign up / log in as a `FARMER`
- Create, update, and delete product listings (name, price, unit, quantity, description)
- View all products they've listed
- View incoming orders and **confirm**, **reject**, or **complete** them
- Automatic stock adjustment when orders are placed, rejected, or cancelled
- Sales history (completed orders) and a dashboard with revenue/order statistics

### For Buyers
- Sign up / log in as a `BUYER`
- Browse all active, in-stock products across all farmers
- View product and farmer details (including location/contact)
- Place multi-item orders against a single farmer (cart-style order creation)
- Track order status (`PENDING`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `COMPLETED`)
- Cancel pending orders (stock is automatically returned)
- Personal dashboard with spending/order statistics

### Platform-wide
- JWT authentication with role-based route protection (`ROLE_FARMER`, `ROLE_BUYER`)
- Optimistic locking on `Product` (via `@Version`) to help handle concurrent stock updates
- Centralized exception handling with consistent JSON error responses
- CORS configuration for cross-origin frontend/backend deployment
- Dockerized backend and frontend, ready for container-based deployment

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | Spring Boot 3.5.7 (Java 17) |
| Security | Spring Security + JWT (`jjwt` 0.11.5) |
| Persistence | Spring Data JPA / Hibernate |
| Database | PostgreSQL (Neon serverless Postgres) |
| Build tool | Maven (`mvnw` wrapper included) |
| Password hashing | BCrypt |
| Frontend framework | React 18 (Create React App / `react-scripts` 5) |
| Routing | React Router DOM v6 |
| HTTP client | Axios |
| Icons | react-icons |
| Containerization | Docker (multi-stage builds), Docker Compose |
| Deployment targets seen in repo | Render (backend), Vercel (frontend) |

---

## Architecture

```
┌─────────────────┐        HTTPS / REST (JSON)        ┌──────────────────────┐
│   React SPA     │  ───────────────────────────────▶ │   Spring Boot API    │
│ (Vercel / Nginx)│  ◀─────────────────────────────── │  (Render / Docker)   │
└─────────────────┘        JWT Bearer token            └──────────┬───────────┘
                                                                    │
                                                                    │ JPA / Hibernate
                                                                    ▼
                                                          ┌──────────────────┐
                                                          │   PostgreSQL     │
                                                          │   (Neon)         │
                                                          └──────────────────┘
```

**Backend layers:**

```
Controller  →  Service  →  Repository  →  Entity  →  Database
   │              │
   │              └── business rules, stock checks, mapping to DTOs
   └── request validation, auth extraction, HTTP semantics
```

**Request flow for a protected endpoint:**
1. Client sends `Authorization: Bearer <token>` header.
2. `JwtAuthenticationFilter` validates the token and populates `SecurityContext` with the user's email and role (`ROLE_FARMER` / `ROLE_BUYER`).
3. `SecurityConfig` enforces path-based role restrictions (e.g. `/api/farmer/**` requires `ROLE_FARMER`).
4. Controllers pull the authenticated user via `Authentication.getName()` (the email) and delegate to services.

---

## Project Structure

```
Farmer-and-buyer-web-app-deploy--main/
├── src/main/java/com/example/farm_marketplace/
│   ├── config/            # Security, CORS, JWT filter
│   │   ├── CorsConfig.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── SecurityConfig.java
│   ├── controller/        # REST endpoints
│   │   ├── AuthController.java      # /api/auth/**
│   │   ├── ProductController.java   # /api/products/** (public browsing)
│   │   ├── FarmerController.java    # /api/farmer/** (FARMER only)
│   │   ├── BuyerController.java     # /api/buyer/** (BUYER only)
│   │   └── UserController.java      # /api/users/**
│   ├── dto/                # Request/response payloads
│   ├── entity/              # JPA entities: User, Product, Order, OrderItem
│   ├── exception/           # Custom exceptions + global handler
│   ├── repository/          # Spring Data JPA repositories
│   ├── service/             # Business logic
│   ├── util/JwtUtil.java     # Low-level JWT generation/validation
│   └── FarmMarketplaceApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── schema.sql             # Reference DDL (Hibernate auto-DDL is also enabled)
├── frontend/
│   ├── src/
│   │   ├── api/                # axios instance + per-resource API modules
│   │   ├── components/         # auth, product, order, common UI components
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/            # Login, Signup
│   │   │   ├── buyer/           # Dashboard, Browse, Orders
│   │   │   ├── farmer/          # Dashboard, Products, Orders, Sales
│   │   │   └── HomePage.jsx / ProfilePage.jsx / NotFound.jsx
│   │   ├── utils/               # constants, helpers (token storage, etc.)
│   │   └── App.jsx              # route definitions
│   ├── Dockerfile               # Node build → Nginx serve
│   ├── nginx.conf               # SPA routing + /api/ reverse proxy
│   └── vercel.json
├── upload/                  # Sample product images used by the app
├── Dockerfile                # Backend multi-stage build (Maven → JRE)
├── docker-compose.yml        # Runs backend + frontend together
└── pom.xml
```

---

## Database Schema

Four core tables (see `src/main/resources/schema.sql`), with relationships enforced via foreign keys:

- **`users`** — stores both farmers and buyers; differentiated by `role` (`FARMER` / `BUYER`). Includes `address`, `state`, `district`, `phone`.
- **`products`** — owned by a farmer (`farmer_id` FK). Has `price`, `unit`, `qty_available`, `active` flag, and a `version` column used for optimistic locking.
- **`orders`** — links a `buyer_id` and `farmer_id`, with a `status` enum (`PENDING`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `COMPLETED`) and a computed `total_amount`.
- **`order_items`** — line items per order, referencing a `product_id`, with `quantity` and `price_each` captured at order time (so later price changes don't retroactively affect past orders).

Indexes exist on the common lookup columns (`farmer_id` on products, `buyer_id`/`farmer_id` on orders, `order_id` on order items).

> Note: `spring.jpa.hibernate.ddl-auto=update` is set, so Hibernate will also auto-create/update tables from the entity annotations at startup — `schema.sql` is present as a readable reference/manual-setup script but isn't the sole source of truth for the schema.

---

## API Reference

Base path: `/api`

### Auth (`/api/auth`) — public
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user (`FARMER` or `BUYER`) |
| POST | `/auth/login` | Authenticate and receive a JWT |
| GET | `/auth/test` | Health check for the auth module |

### Products (`/api/products`) — public read
| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List all active, in-stock products |
| GET | `/products/{id}` | Get a single product's details |
| GET | `/products/farmer/{farmerId}` | List all products from a specific farmer |

### Farmer (`/api/farmer`) — requires `ROLE_FARMER`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/farmer/products` | Create a product listing |
| GET | `/farmer/products` | List the logged-in farmer's own products |
| GET | `/farmer/products/{id}` | Get one of the farmer's own products |
| PUT | `/farmer/products/{id}` | Update a product |
| DELETE | `/farmer/products/{id}` | Delete a product |
| GET | `/farmer/orders?status=` | List received orders (optional status filter) |
| GET | `/farmer/orders/{id}` | Get order details |
| PUT | `/farmer/orders/{id}/confirm` | Confirm a pending order |
| PUT | `/farmer/orders/{id}/reject` | Reject a pending order (restocks items) |
| PUT | `/farmer/orders/{id}/complete` | Mark a confirmed order as completed |
| GET | `/farmer/sales-history` | List completed orders |
| GET | `/farmer/stats` | Dashboard stats (orders by status, revenue) |

### Buyer (`/api/buyer`) — requires `ROLE_BUYER`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/buyer/orders` | Place a new order (single farmer, multiple items) |
| GET | `/buyer/orders?status=` | List the buyer's orders (optional status filter) |
| GET | `/buyer/orders/{id}` | Get order details |
| PUT | `/buyer/orders/{id}/cancel` | Cancel a pending order (restocks items) |
| GET | `/buyer/order-history` | List all past orders |
| GET | `/buyer/orders/pending` | List pending orders |
| GET | `/buyer/stats` | Dashboard stats (orders by status, spend) |

### Users (`/api/users`) — requires authentication
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/me` | Get the logged-in user's profile |
| PUT | `/users/me` | Update the logged-in user's profile |
| GET | `/users/{id}` | View another user's public profile (e.g. a farmer's contact info) |

**Auth header format:** `Authorization: Bearer <jwt>`

---

## Getting Started

### Prerequisites
- Java 17+
- Maven (or use the included `./mvnw` wrapper)
- Node.js 18+ and npm
- A PostgreSQL database (local, or a cloud instance such as Neon/Supabase/RDS)

### 1. Clone and configure the backend

```bash
git clone <your-repo-url>
cd Farmer-and-buyer-web-app-deploy--main
```

Set your own database and JWT configuration (see [Environment Variables](#environment-variables) below) — **do not reuse the credentials currently committed in `application.properties`/`docker-compose.yml`; rotate them first.**

Run the backend:

```bash
./mvnw spring-boot:run
```

The API will start on `http://localhost:8080`.

### 2. Run the frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

The React app will start on `http://localhost:3000` and proxy API calls to whatever `REACT_APP_API_URL` points to (see below).

### 3. Create a test account

Use the signup page (or `POST /api/auth/signup`) to create a `FARMER` and a `BUYER` account, then log in as each to explore both sides of the marketplace.

---

## Environment Variables

### Backend (`src/main/resources/application.properties`)

| Property | Purpose | Current default (⚠️ should be externalized) |
|---|---|---|
| `server.port` | API port | `8080` |
| `spring.datasource.url` | PostgreSQL JDBC URL | Neon connection string |
| `spring.datasource.username` / `password` | DB credentials | Hard-coded — **move to env vars/secrets** |
| `spring.jpa.hibernate.ddl-auto` | Schema auto-management | `update` |
| `jwt.secret` | HMAC signing key for JWTs | Hard-coded string — **must be a long random secret in production** |
| `jwt.expiration` | Token lifetime (ms) | `86400000` (24h) |
| `file.upload-dir` | Local dir for uploaded images | `./uploads` |
| `cors.allowed-origins` | Allowed frontend origin(s) | `http://localhost:3000` |

Recommended production approach: replace hard-coded values with `${DB_URL}`, `${DB_USERNAME}`, `${DB_PASSWORD}`, `${JWT_SECRET}`, `${CORS_ORIGINS}` placeholders and inject them via environment variables (this is already partially done in `docker-compose.yml`).

### Frontend (`frontend/.env`)

| Variable | Purpose |
|---|---|
| `REACT_APP_API_URL` | Base URL the SPA uses for all API calls (e.g. `http://localhost:8080/api` locally, or your deployed backend's `/api` URL in production) |

---

## Running with Docker

A `docker-compose.yml` is provided to run both services together:

```bash
docker compose up --build
```

- Backend → `http://localhost:8080`
- Frontend (served via Nginx) → `http://localhost:3000`, which reverse-proxies `/api/` calls to the `backend` service (see `frontend/nginx.conf`)

**Before running in any shared or production environment**, replace the `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET` values in `docker-compose.yml` with your own secrets (e.g. via a `.env` file referenced with `env_file:`, or a secrets manager) — see the security section below.

---

## Deployment

The repo shows evidence of the following deployment targets:

- **Backend** → Render (`onrender.com`), using the root `Dockerfile`.
- **Frontend** → Vercel (`vercel.json` present) and/or as a static Nginx container (`frontend/Dockerfile` + `nginx.conf`).

General steps for a Render + Vercel deployment:
1. Push the repo to GitHub.
2. On Render, create a new **Web Service** from the repo, using the Docker deploy method (it will pick up the root `Dockerfile`). Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, and `CORS_ALLOWED_ORIGINS` as environment variables in the Render dashboard.
3. On Vercel, import the `frontend` directory as the project root, set `REACT_APP_API_URL` to your Render backend's public URL + `/api`, and deploy.
4. Update the backend's CORS configuration to allow the deployed Vercel origin.

---

## Security Notes & Recommendations

A code review surfaced a few things worth fixing before this goes further into production use:

1. **Committed database credentials.** `application.properties` and `docker-compose.yml` both contain a live PostgreSQL connection string, username, and password. These should be rotated immediately and replaced with environment-variable placeholders (e.g. `${DB_PASSWORD}`), with real values supplied via your hosting platform's secret manager or a local `.env` file that's excluded from version control.
2. **Hard-coded JWT secret.** `jwt.secret` is a plain, guessable sentence. Use a long, random, high-entropy secret (e.g. 256+ bits, generated with a CSPRNG) and inject it via environment variable — never commit it.
3. **Wide-open CORS on controllers.** Several controllers use `@CrossOrigin(origins = "*")` at the class level, which overrides the more restrictive `CorsConfig` bean for those endpoints. Since `allowCredentials(true)` is also set globally, consider consolidating CORS configuration in one place (the `CorsConfig` bean) and removing the wildcard `@CrossOrigin` annotations, restricting origins to your actual frontend domain(s).
4. **Generic exception messages exposed to clients.** `GlobalExceptionHandler`'s catch-all handler returns `ex.getMessage()` for any unhandled `Exception`, which can leak internal details (e.g. SQL error text) to API consumers. Consider logging the full exception server-side and returning a generic message to the client.
5. **`RuntimeException` used for business-rule violations** (e.g. "Invalid credentials", "Only buyers can create orders") instead of dedicated exception types. This works but means these all fall through to the generic 500-level handler rather than returning more precise 4xx status codes — worth refining with custom exception classes mapped to appropriate HTTP statuses (e.g. 401/403/409).
6. **No rate limiting** on `/api/auth/login` or `/api/auth/signup`, leaving them potentially open to brute-force/credential-stuffing attempts.

---

## Known Limitations

- `ProductController.getAllProducts` accepts `search`, `state`, and `district` query parameters but doesn't currently apply any filtering logic — all active/in-stock products are returned regardless of these params.
- File upload handling (`spring.servlet.multipart.*`, `file.upload-dir`) is configured, but no controller endpoint for image upload was found in this codebase — product images currently reference static files in `/upload`.
- No automated test coverage beyond the default Spring Boot application context test (`FarmMarketplaceApplicationTests`).
- Optimistic locking (`@Version` on `Product`) is defined at the entity level, but the order-creation flow doesn't explicitly catch `OptimisticLockException` — a concurrent update conflict would currently surface as a generic 500 error rather than a clear "please retry" message.

---

## Roadmap Ideas

- Add real image upload endpoints (multipart) tied to the existing `file.upload-dir` config.
- Implement the `search` / `state` / `district` product filters that are already wired into the frontend/API contract.
- Introduce refresh tokens or shorter-lived access tokens with rotation.
- Add pagination to product/order listing endpoints.
- Add integration tests for the order lifecycle (create → confirm/reject → complete/cancel) and stock adjustments.

---

## License

No license file is currently included in this repository. Add a `LICENSE` file (e.g. MIT, Apache-2.0) if you intend to open-source this project, or state "All Rights Reserved" if it's private/proprietary.
