import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface Column {
  key: string;
  label: string;
  className?: string;
}

interface AdminTableProps<T> {
  title: string;
  createHref: string;
  createLabel: string;
  columns: Column[];
  data: T[];
  emptyColSpan: number;
  emptyMessage: string;
  renderRow: (item: T) => ReactNode;
}

export default function AdminTable<T extends { id: string }>({
  title,
  createHref,
  createLabel,
  columns,
  data,
  emptyColSpan,
  emptyMessage,
  renderRow,
}: AdminTableProps<T>) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        <Link
          href={createHref}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium",
            "bg-miku-primary text-primary-foreground",
            "hover:bg-miku-primary-dark transition-colors"
          )}
        >
          <Plus className="w-4 h-4" />
          {createLabel}
        </Link>
      </div>

      <div
        className={cn(
          "rounded-3xl backdrop-blur-xl border overflow-x-auto",
          "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.25)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.08)]"
        )}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className={cn(
                "border-b",
                "border-[rgba(168,230,225,0.15)] dark:border-[rgba(255,255,255,0.06)]"
              )}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left font-medium text-muted-foreground",
                    col.className || ""
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={emptyColSpan}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
            {data.map((item) => renderRow(item))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
