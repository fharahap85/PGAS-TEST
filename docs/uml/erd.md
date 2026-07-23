# Entity Relationship Diagram

```mermaid
erDiagram
    DEPARTMENTS {
        INT department_id PK "Auto Increment"
        VARCHAR(100) department_name
    }

    EMPLOYEES {
        INT employee_id PK "Auto Increment"
        VARCHAR(100) employee_name
        INT department_id FK
    }

    SPENDINGS {
        INT spending_id PK "Auto Increment"
        INT employee_id FK
        DATE spending_date
        DECIMAL(12,2) value
    }

    USERS {
        INT user_id PK "Auto Increment"
        VARCHAR(100) username
        VARCHAR(255) email
        VARCHAR(255) password_hash
        ENUM role "admin, user"
        TIMESTAMP created_at
    }

    DEPARTMENTS ||--o{ EMPLOYEES : "has many"
    EMPLOYEES ||--o{ SPENDINGS : "has many"
```

## Relasi

- **Departments → Employees**: One-to-Many (satu departemen punya banyak karyawan)
- **Employees → Spendings**: One-to-Many (satu karyawan punya banyak pengeluaran)
- **Users**: Tabel terpisah untuk autentikasi (tidak ada relasi langsung ke data)
