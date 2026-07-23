-- ============================================
-- Query: Filtered Report - Spending 2020-2025
-- Laporan spending tahun 2020 hingga tahun terbaru (2025)
-- Bulan Januari - Desember, filter berdasarkan rentang value
-- ============================================

-- Report: All spending 2020-2025
SELECT
    e.employee_name AS 'Employee Name',
    d.department_name AS 'Department Name',
    s.spending_date AS 'Spending Date',
    s.value AS 'Spending Value',
    YEAR(s.spending_date) AS 'Year',
    MONTHNAME(s.spending_date) AS 'Month'
FROM spendings s
INNER JOIN employees e ON s.employee_id = e.employee_id
INNER JOIN departments d ON e.department_id = d.department_id
WHERE
    YEAR(s.spending_date) BETWEEN 2020 AND 2025
    AND MONTH(s.spending_date) BETWEEN 1 AND 12
ORDER BY s.spending_date ASC, s.value ASC;

-- Report: With value range filter (example: 100000 - 1000000)
SELECT
    e.employee_name AS 'Employee Name',
    d.department_name AS 'Department Name',
    s.spending_date AS 'Spending Date',
    s.value AS 'Spending Value',
    YEAR(s.spending_date) AS 'Year',
    MONTHNAME(s.spending_date) AS 'Month'
FROM spendings s
INNER JOIN employees e ON s.employee_id = e.employee_id
INNER JOIN departments d ON e.department_id = d.department_id
WHERE
    YEAR(s.spending_date) BETWEEN 2020 AND 2025
    AND MONTH(s.spending_date) BETWEEN 1 AND 12
    AND s.value BETWEEN 100000 AND 1000000
ORDER BY s.spending_date ASC, s.value ASC;
