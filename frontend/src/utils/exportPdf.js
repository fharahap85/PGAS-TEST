import jsPDF from 'jspdf'
import 'jspdf-autotable'

export function exportToPdf(data, columns, title = 'Laporan', filename = 'export.pdf') {
  const doc = new jsPDF()
  doc.text(title, 14, 15)
  doc.autoTable({
    head: [columns.map((c) => c.header)],
    body: data.map((row) => columns.map((c) => row[c.accessorKey])),
    startY: 25,
  })
  doc.save(filename)
}
