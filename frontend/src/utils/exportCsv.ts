/**
 * Generic utility to export an array of JSON objects to a CSV file.
 * Automatically handles stringifying arrays, objects, and escaping commas/quotes.
 */
export function exportToCsv(filename: string, rows: object[]) {
  if (!rows || !rows.length) {
    alert("No data to export");
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(rows[0]);

  const csvContent = [
    // Header row
    headers.join(","),
    ...rows.map((row) => {
      return headers
        .map((fieldName) => {
          let val = (row as any)[fieldName];
          
          if (val === null || val === undefined) {
            val = "";
          } else if (typeof val === "object") {
            // Stringify objects/arrays
            val = JSON.stringify(val);
          } else {
            val = String(val);
          }
          
          // Escape quotes and wrap in quotes if there's a comma, newline, or quote
          if (val.includes(",") || val.includes("\"") || val.includes("\n")) {
            val = `"${val.replace(/"/g, "\"\"")}"`;
          }
          
          return val;
        })
        .join(",");
    }),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create a link and trigger download
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
