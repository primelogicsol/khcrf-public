import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  actions?: boolean;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export default function DataTable({
  columns,
  data,
  actions,
  onView,
  onEdit,
  onDelete,
  loading,
  emptyMessage,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100" role="region" aria-label="Data Table Container" tabIndex={0}>
      <table className="w-full text-sm text-left text-gray-500" role="grid" aria-label="Data Table">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
          <tr role="row">
            {columns.map((col, index) => (
              <th key={index} scope="col" role="columnheader" className="px-6 py-3 font-medium">
                {col.header}
              </th>
            ))}
            {actions && (
              <th scope="col" role="columnheader" className="px-6 py-3 font-medium text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody aria-live="polite" aria-busy={loading}>
          {loading ? (
            <tr role="row">
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                role="gridcell"
                className="px-6 py-8 text-center text-gray-500"
              >
                <div className="flex justify-center items-center gap-2">
                  <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr role="row">
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                role="gridcell"
                className="px-6 py-8 text-center text-gray-400"
              >
                {emptyMessage || "No data available"}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                role="row"
                className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} role="gridcell" className="px-6 py-4">
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : row[col.accessor]}
                  </td>
                ))}
                {actions && (
                  <td role="gridcell" className="px-6 py-4 text-right space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        aria-label="View record"
                        className="text-gray-400 hover:text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary rounded"
                      >
                        <FaEye aria-hidden="true" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        aria-label="Edit record"
                        className="text-gray-400 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      >
                        <FaEdit aria-hidden="true" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        aria-label="Delete record"
                        className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      >
                        <FaTrash aria-hidden="true" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
