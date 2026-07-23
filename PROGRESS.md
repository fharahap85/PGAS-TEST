# PGAS Test — Task Tracker

## Phase 1: Database ✅ COMPLETE
- [x] SQL migration — `database/migrations/001_create_tables.sql` (4 tables: departments, employees, spendings, users)
- [x] SQL seed data — `database/seeds/001_seed_data.sql` (6 depts, 20 employees, 96 spendings, 2 users)
- [x] SQL query files:
  - `database/queries/select_all.sql`
  - `database/queries/join_query.sql`
  - `database/queries/sorted_spending.sql`
  - `database/queries/filtered_report.sql`

## Phase 2: Backend (Express.js) ✅ COMPLETE
- [x] `backend/package.json` + dependencies installed (`node_modules` ready)
- [x] `backend/.env.example`
- [x] Config: `src/config/database.js` (MySQL pool), `src/config/swagger.js` (OpenAPI 3.0)
- [x] Models (OOP, raw SQL):
  - `src/models/BaseModel.js` — base class with findAll, findById, count, delete
  - `src/models/Department.js` — extends BaseModel, create/update/search
  - `src/models/Employee.js` — extends BaseModel, create/update/search/findAllWithDepartment
  - `src/models/Spending.js` — extends BaseModel, create/update/getJoinedData/getReport/getValueRange/getDistinctYears
  - `src/models/User.js` — extends BaseModel, findByEmail/create/verifyPassword (bcrypt)
- [x] Middlewares: `authMiddleware.js` (JWT verify), `roleMiddleware.js` (role-based access)
- [x] Controllers: `authController.js`, `departmentController.js`, `employeeController.js`, `spendingController.js` (includes export Excel/PDF/Power BI)
- [x] Routes (with Swagger JSDoc): `authRoutes.js`, `departmentRoutes.js`, `employeeRoutes.js`, `spendingRoutes.js`, `reportRoutes.js`
- [x] `src/app.js` — Express entry point with Swagger UI at `/api-docs`

## Phase 3: Frontend (React + Vite + Tailwind + shadcn) ⏳ IN PROGRESS
- [x] Vite project scaffolded (`frontend/` directory)
- [x] Dependencies installed: react-router-dom, axios, recharts, @tanstack/react-table, jspdf, xlsx, lucide-react, clsx, tailwind-merge, class-variance-authority, Radix UI primitives, TailwindCSS v4
- [ ] **Configure Tailwind** — update `vite.config.js` with `@tailwindcss/vite` plugin, create `src/index.css` with `@import "tailwindcss"`
- [ ] **shadcn/ui utility** — create `src/lib/utils.js` with `cn()` helper
- [ ] **shadcn components** — manually create components in `src/components/ui/`:
  - button, input, label, select, slider, dialog, alert-dialog, dropdown-menu, table, tabs, toast, card, badge
- [ ] **API service** — `src/services/api.js` (Axios instance with JWT interceptor)
- [ ] **Auth context** — `src/contexts/AuthContext.jsx` (login state, token management)
- [ ] **Hooks** — `useAuth.js`, `usePermission.js`
- [ ] **Layout** — `src/components/Layout/` (sidebar, header, protected route wrapper)
- [ ] **Pages**:
  - [ ] `LoginPage.jsx` — email/password form, JWT storage
  - [ ] `DashboardPage.jsx` — summary cards, overview
  - [ ] `EmployeesPage.jsx` — CRUD table with search, role-based buttons
  - [ ] `DepartmentsPage.jsx` — CRUD table with search, role-based buttons
  - [ ] `SpendingsPage.jsx` — CRUD table, role-based buttons
  - [ ] `ReportPage.jsx` — joined data table, filters (dropdown year/month, slider value range, input min-max), export Excel/PDF buttons
- [ ] **Access Denied Alert** — show "Akses ditolak: Hanya Admin yang dapat melakukan aksi ini." when User tries Update/Delete

## Phase 4: Docker & Deployment ✅ COMPLETE
- [x] `docker-compose.yml` — db, backend, nginx, certbot services
- [x] `Dockerfile.backend`
- [x] `docker/nginx/default.conf` — configured for `pgas.heyfik.net`
- [x] `.env.example` (root)
- [x] `.dockerignore`
- [x] `.gitignore`

## Phase 5: Documentation 🔲 NOT STARTED
- [ ] `docs/uml/erd.md` — Mermaid ERD diagram
- [ ] `docs/uml/use-case.md` — Mermaid Use Case diagram
- [ ] `docs/uml/sequence.md` — Mermaid Sequence diagram
- [ ] `README.md` — setup guide, screenshots, architecture, API docs link, demo credentials
- [ ] Git init + initial commit with conventional commits

---

## 🔑 Key Info for Next Session

### Seed User Credentials
- **Admin**: `admin@pgastest.com` / `admin123`
- **User**: `user@pgastest.com` / `user123`

### bcrypt Hash Note
The seed file uses a placeholder bcrypt hash. On first session resume, **regenerate proper hashes** by running:
```js
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(console.log);
```
Then update `database/seeds/001_seed_data.sql` with the real hashes.

### What to Do Next (Priority Order)
1. **Frontend source files** — this is the biggest remaining chunk (~70% of remaining work)
2. **Test backend locally** — `docker compose up db backend` then hit `/api/health`
3. **UML docs** — quick wins, can be done from PRD diagrams
4. **README.md** — write after frontend is done
5. **Deploy to VPS** — final step after everything works locally

### Domain & VPS
- **Domain**: `pgas.heyfik.net`
- **VPS IP**: `43.129.57.220`
- **Deadline**: Jumat, 25 Juli 2026 — 23:59 WIB
