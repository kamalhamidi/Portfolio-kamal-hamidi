'use client';

import { Pencil, Trash2 } from 'lucide-react';

export interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
    columns: Column<T>[];
    data: T[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

export default function DataTable<T extends { id: string }>({
    columns,
    data,
    onEdit,
    onDelete,
}: DataTableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="text-left py-3 px-4 text-xs font-mono text-text-secondary uppercase tracking-wider"
                            >
                                {col.label}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th className="text-right py-3 px-4 text-xs font-mono text-text-secondary uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b border-border/50 hover:bg-bg-elevated/50 transition-colors"
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="py-3 px-4 text-text-primary">
                                    {col.render
                                        ? col.render(item)
                                        : String((item as Record<string, unknown>)[col.key] ?? '')}
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-1.5 rounded-md hover:bg-accent/10 text-text-secondary hover:text-accent transition-colors"
                                                aria-label="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="p-1.5 rounded-md hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors"
                                                aria-label="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                className="py-12 text-center text-text-secondary"
                            >
                                No data to display.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
