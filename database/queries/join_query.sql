-- ============================================
-- Query: JOIN - Gabungan employees, departments, spendings
-- Kolom: Employee Name, Department Name, Spending Date, Spending Value
-- ============================================

SELECT
    e.employee_name AS 'Employee Name',
    d.department_name AS 'Department Name',
    s.spending_date AS 'Spending Date',
    s.value AS 'Spending Value'
FROM spendings s
INNER JOIN employees e ON s.employee_id = e.employee_id
INNER JOIN departments d ON e.department_id = d.department_id;
