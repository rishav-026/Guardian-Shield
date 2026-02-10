import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const exportCSV = (rows, filename = 'guardian-report.csv') => {
  const headers = Object.keys(rows[0] || {})
  const csv = [headers.join(',')]
  rows.forEach((row) => {
    csv.push(headers.map((h) => JSON.stringify(row[h] ?? '')).join(','))
  })
  const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const exportPDF = (title, rows) => {
  const doc = new jsPDF()
  doc.text(title, 14, 16)
  const headers = Object.keys(rows[0] || {})
  const body = rows.map((row) => headers.map((h) => row[h]))
  doc.autoTable({ head: [headers], body })
  doc.save(`${title.replace(/\s+/g, '-')}.pdf`)
}
