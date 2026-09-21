export function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToCsv(filename: string, rows: any[][]) {
  const csvContent = rows.map(row => 
    row.map(cell => {
      let cellStr = String(cell === null || cell === undefined ? '' : cell);
      // Escape quotes
      cellStr = cellStr.replace(/"/g, '""');
      // Wrap in quotes if it contains comma, quote, or newline
      if (cellStr.search(/("|,|\n)/g) >= 0) {
        cellStr = `"${cellStr}"`;
      }
      return cellStr;
    }).join(",")
  ).join("\n");
  
  triggerDownload(filename, csvContent, 'text/csv;charset=utf-8;');
}

export function exportToJson(filename: string, data: any) {
  const jsonContent = JSON.stringify(data, null, 2);
  triggerDownload(filename, jsonContent, 'application/json;charset=utf-8;');
}

export function logExportAudit(module: string, format: string, recordCount: number) {
  console.info("[SKC EXPORT]", {
    module,
    format,
    recordCount,
    timestamp: new Date().toISOString()
  });
}
