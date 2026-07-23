-- ============================================
-- Query: ORDER BY - Sorted by Spending Value (ASC)
-- Pengurutan berdasarkan nilai pengeluaran terkecil ke terbesar
-- ============================================

SELECT
    e.employee_name AS 'Employee Name',
    d.department_name AS 'Department Name',
    s.spending_date AS 'Spending Date',
    s.value AS 'Spending Value'
FROM spendings s
INNER JOIN employees e ON s.employee_id = e.employee_id
INNER JOIN departments d ON e.department_id = d.department_id
ORDER BY s.value ASC;
