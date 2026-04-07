import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export type DataColumn<T> = {
  header: string;
  accessor: (row: T) => ReactNode;
};

export function DataTable<T>({
  columns,
  data,
}: {
  columns: DataColumn<T>[];
  data: T[];
}) {
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--muted)]">
          <tr>
            {columns.map((column) => (
              <th key={column.header} className="px-4 py-3 font-semibold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-t border-[var(--border)]">
              {columns.map((column) => (
                <td key={column.header} className="px-4 py-3">
                  {column.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
