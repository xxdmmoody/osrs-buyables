import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ArrowUp, ArrowDown, TrendingDown, TrendingUp } from 'lucide-react';
import { formatGP, formatNumber } from '../utils/formatters';
import { Tooltip } from './Tooltip';
import { getItemImageUrl } from '../utils/osrsImages';

export function BuyablesTable({ data, skill }) {
  const isPrayerSkill = skill === 'prayer';

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
              <div className="flex items-center gap-3">
                {!imageError ? (
                  <img
                    src={getItemImageUrl(itemName)}
                    alt={itemName}
                    loading="lazy"
                    className="w-7 h-7 object-contain flex-shrink-0 transition-transform group-hover:scale-110"
                    onError={() => setImageError(true)}
                    style={{ imageRendering: 'pixelated' }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-light-accent/10 dark:bg-dark-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-light-accent dark:text-dark-accent">?</span>
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
          header: 'Lvl',
          cell: (info) => (
            <div className="font-mono text-sm font-semibold text-light-accent dark:text-dark-accent">
              {info.getValue()}
            </div>
          ),
        },
        {
          accessorKey: 'xpGained',
          header: 'XP Gain',
          cell: (info) => (
            <div className="font-mono text-sm text-light-muted dark:text-dark-muted">
              {formatNumber(info.getValue(), 1)}
            </div>
          ),
        },
      ];

      // Only show Sell Price for non-Prayer skills
      if (!isPrayerSkill) {
        baseColumns.push({
          accessorKey: 'sellPrice',
          header: 'Sell',
          cell: (info) => (
            <div className="font-mono text-sm text-light-text dark:text-dark-text">
              {formatGP(info.getValue())}
            </div>
          ),
        });
      }

      // Material Cost column
      baseColumns.push({
        accessorKey: 'materialCost',
        header: 'Cost',
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
              <div className="font-mono text-sm text-light-text dark:text-dark-text cursor-help underline decoration-dotted decoration-light-border dark:decoration-dark-border hover:decoration-light-accent dark:hover:decoration-dark-accent transition-colors">
                {formatGP(info.getValue())}
              </div>
            </Tooltip>
          );
        },
      });

      // Only show Net Profit for non-Prayer skills
      if (!isPrayerSkill) {
        baseColumns.push({
          accessorKey: 'netProfit',
          header: 'Profit',
          cell: (info) => {
            const value = info.getValue();
            const isProfit = value > 0;
            return (
              <div
                className={`font-mono text-sm font-semibold flex items-center gap-1 ${
                  isProfit
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isProfit ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {isProfit ? '+' : ''}{formatGP(value)}
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
          // For Prayer, positive value = cost (always red)
          // For other skills, negative = profit (green), positive = cost (red)
          const isProfit = !isPrayerSkill && value < 0;
          return (
            <div
              className={`font-mono font-bold text-sm px-2 py-1 rounded-md ${
                isProfit
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}
            >
              {formatNumber(value, 2)}
            </div>
          );
        },
      });

      return baseColumns;
    },
    [isPrayerSkill]
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'pricePerXp',
          desc: false, // Ascending = best value first
        },
      ],
    },
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-light-border dark:border-dark-border shadow-sm">
      <table className="w-full">
        <thead className="bg-light-accent/5 dark:bg-dark-accent/10 border-b border-light-border dark:border-dark-border">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-xs font-display font-bold text-light-accent dark:text-dark-accent uppercase tracking-widest cursor-pointer hover:bg-light-accent/10 dark:hover:bg-dark-accent/20 select-none transition-colors"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() && (
                      <span className="text-light-accent/60 dark:text-dark-accent/60">
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
        <tbody className="divide-y divide-light-border dark:divide-dark-border">
          {table.getRowModel().rows.map((row, idx) => (
            <tr
              key={row.id}
              className="hover:bg-light-accent/5 dark:hover:bg-dark-accent/10 transition-all duration-200 hover:shadow-inner group"
              style={{
                animationDelay: `${idx * 0.03}s`,
                animation: 'fadeIn 0.4s ease-out forwards',
                opacity: 0,
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-3 whitespace-nowrap text-sm transition-colors"
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
