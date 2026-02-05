import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatGP, formatNumber, formatXP } from '../utils/formatters';
import { Tooltip } from './Tooltip';
import { getItemImageUrl } from '../utils/osrsImages';

export function BuyablesTable({ data, skill, onSortChange }) {
  const isNonSellableSkill = skill === 'prayer' || skill === 'construction';

  const columns = useMemo(
    () => {
      const baseColumns = [
        {
          accessorKey: 'name',
          header: 'Item',
          cell: (info) => {
            const itemName = info.getValue();
            const [imageError, setImageError] = useState(false);

            return (
              <div className="flex items-center gap-1">
                {!imageError ? (
                  <img
                    src={getItemImageUrl(itemName, skill)}
                    alt={itemName}
                    loading="lazy"
                    className="w-6 h-6 object-contain flex-shrink-0"
                    onError={() => setImageError(true)}
                    style={{ imageRendering: 'pixelated' }}
                  />
                ) : (
                  <div className="w-7 h-7 bg-light-hover dark:bg-dark-hover rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-light-muted dark:text-dark-muted">?</span>
                  </div>
                )}
                <div className="font-medium text-light-text dark:text-dark-text">
                  {itemName}
                </div>
              </div>
            );
          },
        },
        {
          accessorKey: 'level',
          header: 'Level',
          cell: (info) => (
            <div className="text-light-muted dark:text-dark-muted">
              {info.getValue()}
            </div>
          ),
        },
        {
          accessorKey: 'xpGained',
          header: 'XP',
          cell: (info) => (
            <div className="text-light-muted dark:text-dark-muted">
              {formatNumber(info.getValue(), 1)}
            </div>
          ),
        },
        {
          accessorKey: 'xpPerHour',
          header: 'XP/hr',
          cell: (info) => {
            const value = info.getValue();
            if (!value) return <div className="text-light-muted dark:text-dark-muted">-</div>;
            return (
              <div className="text-light-text dark:text-dark-text font-medium">
                {formatXP(value)}
              </div>
            );
          },
        },
      ];

      // Only show Sell Price for non-Prayer skills
      if (!isNonSellableSkill) {
        baseColumns.push({
          accessorKey: 'sellPrice',
          header: 'Sell Price',
          cell: (info) => (
            <div className="text-light-text dark:text-dark-text">
              {formatGP(info.getValue())} GP
            </div>
          ),
        });
      }

      // Material Cost column
      baseColumns.push({
        accessorKey: 'materialCost',
        header: 'Material Cost',
        cell: (info) => {
          const row = info.row.original;
          const materials = row.materials || [];

          // Build tooltip content with material breakdown
          const tooltipContent = materials.length > 0 ? (
            <div className="text-left">
              <div className="font-semibold mb-1.5 text-gray-100">Materials:</div>
              {materials.map((mat, idx) => (
                <div key={idx} className="flex justify-between gap-4 py-0.5">
                  <span className="text-gray-300">
                    {mat.quantity}x {mat.name}
                  </span>
                  <span className="text-gray-100 font-medium">
                    {formatGP(mat.totalCost)} GP
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-600 mt-1.5 pt-1.5 flex justify-between gap-4">
                <span className="font-semibold text-gray-100">Total:</span>
                <span className="font-bold text-gray-100">
                  {formatGP(info.getValue())} GP
                </span>
              </div>
            </div>
          ) : null;

          return (
            <Tooltip content={tooltipContent}>
              <div className="text-light-text dark:text-dark-text cursor-help underline decoration-dotted decoration-light-border dark:decoration-dark-border">
                {formatGP(info.getValue())} GP
              </div>
            </Tooltip>
          );
        },
      });

      // Only show Net Profit for non-Prayer skills
      if (!isNonSellableSkill) {
        baseColumns.push({
          accessorKey: 'netProfit',
          header: 'Net Profit',
          cell: (info) => {
            const value = info.getValue();
            const isProfit = value > 0;
            return (
              <div
                className={`font-medium ${
                  isProfit
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isProfit ? '+' : ''}{formatGP(value)} GP
              </div>
            );
          },
        });
      }

      // GP/XP column
      baseColumns.push({
        accessorKey: 'pricePerXp',
        header: 'GP/XP',
        cell: (info) => {
          const value = info.getValue();
          // For Prayer, negative value = cost (always red)
          // For other skills, positive = profit (green), negative = cost (red)
          const isProfit = !isNonSellableSkill && value > 0;
          return (
            <div
              className={`font-bold ${
                isProfit
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatNumber(value, 2)}
            </div>
          );
        },
      });

      return baseColumns;
    },
    [isNonSellableSkill]
  );

  const [sorting, setSorting] = useState([
    {
      id: 'pricePerXp',
      desc: true, // Descending = best value (highest profit) first
    },
  ]);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);

      // Notify parent of sort change
      if (onSortChange && newSorting.length > 0) {
        const sortColumn = newSorting[0];
        onSortChange(sortColumn.id, sortColumn.desc);
      }
    },
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-light-border dark:border-dark-border">
      <table className="w-full">
        <thead className="bg-light-hover dark:bg-dark-surface border-b border-light-border dark:border-dark-border">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-light-muted dark:text-dark-muted uppercase tracking-wider cursor-pointer hover:bg-light-bg dark:hover:bg-dark-bg select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() && (
                      <span>
                        {header.column.getIsSorted() === 'desc' ? (
                          <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowUp className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-light-surface dark:bg-dark-bg divide-y divide-light-border dark:divide-dark-border">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-2 whitespace-nowrap text-sm"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
