import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc' | null;

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  className?: string;
  onClick?: (item: T) => void;
  clickable?: boolean;
}

interface SortableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: keyof T, direction: SortDirection) => void;
  sortKey?: keyof T;
  sortDirection?: SortDirection;
  className?: string;
  emptyMessage?: string;
}

function SortableTable<T extends Record<string, unknown>>({
  data,
  columns,
  onSort,
  sortKey,
  sortDirection,
  className = '',
  emptyMessage = 'لا توجد بيانات'
}: SortableTableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;

    let newDirection: SortDirection = 'asc';
    if (sortKey === column.key) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = null;
      }
    }
    onSort(column.key, newDirection);
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    
    if (sortKey !== column.key) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-4 w-4 text-deep-teal" />;
    }
    
    if (sortDirection === 'desc') {
      return <ChevronDown className="h-4 w-4 text-deep-teal" />;
    }
    
    return <ChevronUp className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className={`bg-light-cream rounded-2xl shadow-md overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-warm-cream border-b border-light-cream">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-xs font-medium text-deep-teal uppercase tracking-wider ${
                    column.className ? column.className : 'text-right'
                  } ${column.sortable ? 'cursor-pointer hover:bg-soft-teal/20 transition-colors' : ''}`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <span>{column.label}</span>
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-light-cream text-deep-teal">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-soft-teal">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-bright-orange/10 transition-colors">
                  {columns.map((column) => (
                    <td 
                      key={String(column.key)} 
                      className={`px-6 py-4 ${column.className ? column.className : 'text-right'} ${
                        column.clickable ? 'cursor-pointer hover:bg-bright-orange/5' : ''
                      }`}
                      onClick={() => column.onClick && column.clickable ? column.onClick(item) : undefined}
                    >
                      {column.render 
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '')
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SortableTable; 