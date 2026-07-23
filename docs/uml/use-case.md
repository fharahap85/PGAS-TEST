# Use Case Diagram

```mermaid
graph LR
    subgraph "Sistem PGAS"
        UC1["Login"]
        UC2["CRUD Employees"]
        UC3["CRUD Departments"]
        UC4["CRUD Spendings"]
        UC5["Search Data"]
        UC6["View Joined Table"]
        UC7["View Report"]
        UC8["Filter Report"]
        UC9["Export Excel/PDF"]
    end

    Admin((Admin)) --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9

    User((User)) --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
```

## Role-Based Access

| Fitur | Admin | User |
|-------|-------|------|
| CRUD Employees | Full (Create, Read, Update, Delete) | Create & Read only |
| CRUD Departments | Full | Create & Read only |
| CRUD Spendings | Full | Create & Read only |
| Search | ✅ | ✅ |
| View Joined Table | ✅ | ✅ |
| View Report | ✅ | ✅ |
| Filter Report | ✅ | ✅ |
| Export Excel/PDF | ✅ | ✅ |
