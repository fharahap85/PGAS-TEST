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

### ✅ Foundation
- [x] `vite.config.js` — `@tailwindcss/vite` plugin, `@/` path alias, API proxy (`/api` → localhost:3001)
- [x] `src/index.css` — Tailwind v4 `@import "tailwindcss"` + `@theme` design tokens (primary blue, surface slate, success/warning/danger, radius, animations)
- [x] `index.html` — title "PGAS Solution", meta description, lang="id"
- [x] `src/lib/utils.js` — `cn()` (clsx + tailwind-merge), `formatRupiah()`, `formatDate()`, `formatDateInput()`

### ✅ shadcn/ui Components (13 files created)
- [x] `src/components/ui/button.jsx` — CVA variants (default, destructive, outline, secondary, ghost, link)
- [x] `src/components/ui/input.jsx` — styled input with focus ring
- [x] `src/components/ui/label.jsx` — Radix Label
- [x] `src/components/ui/card.jsx` — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- [x] `src/components/ui/badge.jsx` — CVA variants (default, secondary, success, warning, destructive, outline)
- [x] `src/components/ui/select.jsx` — Radix Select (Trigger, Content, Item, Label, Separator)
- [x] `src/components/ui/slider.jsx` — Radix Slider (dual-thumb support)
- [x] `src/components/ui/dialog.jsx` — Radix Dialog (modal for CRUD forms)
- [x] `src/components/ui/alert-dialog.jsx` — Radix AlertDialog (delete confirmation)
- [x] `src/components/ui/dropdown-menu.jsx` — Radix DropdownMenu (user menu)
- [x] `src/components/ui/table.jsx` — Table, TableHeader, TableBody, TableRow, TableHead, TableCell
- [x] `src/components/ui/toast.jsx` — Radix Toast (variants: default, success, destructive, warning)
- [x] `src/components/ui/toaster.jsx` — Toaster wrapper rendering active toasts

### ✅ API Service + Auth
- [x] `src/services/api.js` — Axios instance, JWT request interceptor, 401 response interceptor, API methods for auth/departments/employees/spendings/reports
- [x] `src/contexts/AuthContext.jsx` — AuthProvider, login/logout, localStorage persistence, isAdmin flag
- [x] `src/hooks/useAuth.js` — useAuth() consuming AuthContext
- [x] `src/hooks/usePermission.js` — usePermission() with checkPermission() showing "Akses ditolak" toast
- [x] `src/hooks/useToast.js` — imperative toast system (add/dismiss/remove)

### ✅ Layout & Routing
- [x] **Layout** — `Sidebar.jsx`, `Header.jsx`, `AppLayout.jsx`, `ProtectedRoute.jsx`
- [x] **App Entry** — rewrite `main.jsx` (BrowserRouter + AuthProvider + Toaster), rewrite `App.jsx` (React Router routes)
- [x] **Delete App.css** — unused boilerplate removed

### ✅ Pages
- [x] `LoginPage.jsx` — email/password form, JWT storage
- [x] `DashboardPage.jsx` — summary cards, Recharts bar chart
- [x] `EmployeesPage.jsx` — CRUD table with search, role-based buttons (+ Dialog/AlertDialog)
- [x] `DepartmentsPage.jsx` — CRUD table with search, role-based buttons (+ Dialog/AlertDialog)
- [x] `SpendingsPage.jsx` — CRUD table, role-based buttons (+ Dialog/AlertDialog)
- [x] `ReportPage.jsx` — joined data table, filters (dropdown year/month, slider value range, input min-max), export Excel/PDF buttons

### ✅ Reusable Components
- [x] `DataTable.jsx` — reusable TanStack Table wrapper with sorting, pagination, search
- [x] **Access Denied Alert** — via `usePermission()` showing "Akses ditolak: Hanya Admin..." toast
- [x] `utils/exportExcel.js` — SheetJS helper
- [x] `utils/exportPdf.js` — jsPDF helper

## Phase 4: Docker & Deployment ✅ COMPLETE
- [x] `docker-compose.yml` — db, backend, nginx, certbot services
- [x] `Dockerfile.backend`
- [x] `docker/nginx/default.conf` — configured for `pgas.heyfik.net`
- [x] `.env.example` (root)
- [x] `.dockerignore`
- [x] `.gitignore`

## Phase 5: Documentation ✅ COMPLETE
- [x] `docs/uml/erd.md` — Mermaid ERD diagram
- [x] `docs/uml/use-case.md` — Mermaid Use Case diagram
- [x] `docs/uml/sequence.md` — Mermaid Sequence diagram (Login, CRUD, Export)
- [x] `README.md` — setup guide, architecture, API docs link, demo credentials

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
1. **Layout components** — Sidebar, Header, AppLayout, ProtectedRoute (~4 files)
2. **App entry rewrite** — main.jsx + App.jsx with React Router (~2 files)
3. **LoginPage** — first functional page
4. **DataTable** — reusable component needed by 4 pages
5. **CRUD pages** — Employees, Departments, Spendings (~3 pages)
6. **ReportPage** — most complex page (filters, export)
7. **DashboardPage** — summary cards + chart
8. **UML docs** — quick wins from PRD diagrams
9. **README.md** — write after frontend is done
10. **Build test** — `npm run build` to verify everything compiles
11. **Deploy to VPS** — final step

### Files Created This Session (22 files)
```
frontend/vite.config.js              (modified)
frontend/index.html                  (modified)
frontend/src/index.css               (modified)
frontend/src/lib/utils.js            (new)
frontend/src/components/ui/button.jsx       (new)
frontend/src/components/ui/input.jsx        (new)
frontend/src/components/ui/label.jsx        (new)
frontend/src/components/ui/card.jsx         (new)
frontend/src/components/ui/badge.jsx        (new)
frontend/src/components/ui/select.jsx       (new)
frontend/src/components/ui/slider.jsx       (new)
frontend/src/components/ui/dialog.jsx       (new)
frontend/src/components/ui/alert-dialog.jsx (new)
frontend/src/components/ui/dropdown-menu.jsx(new)
frontend/src/components/ui/table.jsx        (new)
frontend/src/components/ui/toast.jsx        (new)
frontend/src/components/ui/toaster.jsx      (new)
frontend/src/services/api.js               (new)
frontend/src/contexts/AuthContext.jsx       (new)
frontend/src/hooks/useAuth.js              (new)
frontend/src/hooks/usePermission.js        (new)
frontend/src/hooks/useToast.js             (new)
```

### Domain & VPS
- **Domain**: `pgas.heyfik.net`
- **VPS IP**: `43.129.57.220`
- **Deadline**: Jumat, 24 Juli 2026 — 23:59 WIB
