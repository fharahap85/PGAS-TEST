# PGAS Solution — Sistem Manajemen Data Karyawan

Full-stack web application untuk manajemen data karyawan, departemen, dan pengeluaran (spending). Dibangun untuk **Soal Test Pemrograman ICT PT PGAS Solution**.

## Fitur

- **Authentication** — Login dengan JWT (Admin & User role)
- **Role-Based Access** — Admin: full CRUD, User: Create & Read only
- **CRUD Data** — Kelola Karyawan, Departemen, Pengeluaran
- **Data Table** — Sorting, pagination, search
- **Laporan** — Filter tahun, bulan, range nilai (slider + input)
- **Export** — Excel (.xlsx) & PDF (.pdf)
- **Dashboard** — Summary cards + chart pengeluaran per departemen
- **Swagger Docs** — Dokumentasi API interaktif di `/api-docs`

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19 + Vite 8 + TailwindCSS 4 + shadcn/ui |
| Backend | Node.js + Express.js |
| Database | MySQL 8 (raw SQL queries) |
| Auth | JWT + bcrypt |
| Charts | Recharts |
| Export | SheetJS (Excel), jsPDF (PDF) |
| Deployment | Docker Compose (NGINX + Express + MySQL) |

## Demo

- **URL**: https://pgas.heyfik.net
- **Swagger**: https://pgas.heyfik.net/api-docs

### Credential

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@pgastest.com | admin123 |
| User | user@pgastest.com | user123 |

## Cara Menjalankan

### Prerequisites
- Node.js 20+
- MySQL 8 (atau Docker)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env dengan konfigurasi MySQL
npm install
npm run migrate  # Jalankan migration & seed
npm start        # http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

### Docker (Production)

```bash
cp .env.example .env
# Edit .env dengan konfigurasi
docker compose up -d --build
```

## API Endpoints

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| POST | /api/auth/login | Login | Public |
| POST | /api/auth/register | Register | Public |
| GET | /api/auth/me | Current user | Authenticated |
| GET | /api/departments | List departemen | User, Admin |
| POST | /api/departments | Create departemen | User, Admin |
| PUT | /api/departments/:id | Update departemen | Admin |
| DELETE | /api/departments/:id | Delete departemen | Admin |
| GET | /api/employees | List karyawan | User, Admin |
| POST | /api/employees | Create karyawan | User, Admin |
| PUT | /api/employees/:id | Update karyawan | Admin |
| DELETE | /api/employees/:id | Delete karyawan | Admin |
| GET | /api/spendings | List pengeluaran | User, Admin |
| POST | /api/spendings | Create pengeluaran | User, Admin |
| PUT | /api/spendings/:id | Update pengeluaran | Admin |
| DELETE | /api/spendings/:id | Delete pengeluaran | Admin |
| GET | /api/reports/spendings | Laporan + filter | User, Admin |
| GET | /api/reports/spendings/export/excel | Export Excel | User, Admin |
| GET | /api/reports/spendings/export/pdf | Export PDF | User, Admin |
| GET | /api/reports/power-bi | Power BI ready | User, Admin |

## Database Queries (Bare SQL)

Semua query ada di `database/queries/`:
- `select_all.sql` — SELECT seluruh data
- `join_query.sql` — JOIN 3 tabel
- `sorted_spending.sql` — ORDER BY value ASC
- `filtered_report.sql` — Filter tahun, bulan, range nilai

## Struktur Proyek

```
PGAS-TEST/
├── backend/          # Express.js API
│   ├── src/
│   │   ├── config/   # Database pool, Swagger
│   │   ├── controllers/
│   │   ├── middlewares/  # JWT auth, role check
│   │   ├── models/       # OOP class-based (raw SQL)
│   │   ├── routes/
│   │   └── app.js
│   └── tests/
├── frontend/         # React + Vite SPA
│   └── src/
│       ├── components/   # Layout, UI (shadcn), DataTable
│       ├── contexts/     # AuthContext
│       ├── hooks/        # useAuth, usePermission, useToast
│       ├── lib/          # Utils (cn, formatRupiah)
│       ├── pages/        # Login, Dashboard, CRUD, Report
│       └── services/     # Axios API client
├── database/         # SQL migrations, seeds, queries
│   ├── migrations/
│   ├── seeds/
│   └── queries/
├── docker/           # NGINX config
├── docs/             # UML diagrams, screenshots
└── docker-compose.yml
```

## UML Diagrams

- [ERD](docs/uml/erd.md)
- [Use Case](docs/uml/use-case.md)
- [Sequence](docs/uml/sequence.md)

## Screenshots

### Database Queries

| Query | Screenshot |
|-------|-----------|
| Seluruh Data Departments | ![Departments](docs/screenshots/01%20Seluruh%20data%20departments.png) |
| Seluruh Data Employees | ![Employees](docs/screenshots/02%20Seluruh%20data%20employees.png) |
| Seluruh Data Spendings | ![Spendings](docs/screenshots/03%20Seluruh%20data%20spendings.png) |
| JOIN 3 Tabel | ![JOIN](docs/screenshots/04%20Gabungan%20employees%2C%20departments%2C%20spendings.png) |
| ORDER BY value ASC | ![Order By](docs/screenshots/05%20Pengurutan%20berdasarkan%20nilai%20pengeluaran%20terkecil%20ke%20terbesar.png) |
| Laporan Filter Tahun Bulan | ![Filter 1](docs/screenshots/06%20Laporan%20spending%20tahun%202020%20hingga%20tahun%20terbaru%20(2025).png) |
| Laporan Filter Value Range | ![Filter 2](docs/screenshots/07%20Report%20With%20value%20range%20filter%20(example%20100000%20-%201000000).png) |

## Power BI

### Endpoint
`GET /api/reports/power-bi` — mengembalikan data flat JSON (92 records spending 2020-2025) dengan kolom:
`spending_id`, `employee_name`, `department_name`, `spending_date`, `value`, `year`, `month`, `month_name`

### Dashboard File
File `.pbix` tersedia di [`docs/power-bi/PGAS-Dashboard.pbix`](docs/power-bi/PGAS-Dashboard.pbix).

### Cara Import
1. Buka **Power BI Desktop** → **Get Data** → **Web**
2. URL: `https://pgas.heyfik.net/api/reports/power-bi`
3. Klik **Record** → **Convert to Table** → Expand kolom → **Load**
4. Dashboard siap dengan visual: pie chart per departemen, line chart tren tahunan, slicer filter

### Visual dalam .pbix
- **KPI Card**: Total spending, Total transaksi
- **Bar Chart**: Spending per departemen
- **Line Chart**: Tren pengeluaran per tahun
- **Slicer**: Filter tahun & bulan
