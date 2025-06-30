'use client';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, getFilteredRowModel, ColumnFiltersState, getSortedRowModel, SortingState } from '@tanstack/react-table';
import type { PortfolioStock } from '@/types/portfolio';
import React from 'react';
import TableFilters from './TableFilters';

const columnHelper = createColumnHelper<PortfolioStock>();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const columns = [
  columnHelper.accessor('name', {
    header: 'Particulars',
    cell: (info) => (
      <div>
        <p className="font-bold"> {info.getValue()} </p>
        <p className="text-xs text-gray-400"> {info.row.original.sector} </p>
      </div>
    )
  }),
  columnHelper.accessor('sector', {
    header: 'Sector'
  }),
  columnHelper.accessor('exchange', {
    header: 'Exchange',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('purchasePrice', {
    header: 'Purchase Price',
    cell: (info) => formatCurrency(info.getValue() as number)
  }),
  columnHelper.accessor('quantity', {
    header: 'Qty',
    cell: (info) => (info.getValue() as number).toLocaleString('en-IN')
  }),
  columnHelper.accessor('investment', {
    header: 'Investment',
    cell: (info) => formatCurrency(info.getValue() as number)
  }),
  columnHelper.accessor('portfolioPercentage', {
    header: 'Portfolio %',
    cell: (info) => `${(info.getValue() as number).toFixed(2)}%`
  }),
  columnHelper.accessor('marketData.cmp', {
    header: 'CMP',
    cell: (info) => (info.getValue() ? formatCurrency(info.getValue() as number) : 'N/A')
  }),
  columnHelper.accessor('presentValue', {
    header: 'Present Value',
    cell: (info) => formatCurrency(info.getValue() as number)
  }),
  columnHelper.accessor('gainLoss', {
    header: 'Gain/Loss',
    cell: (info) => {
      const value = info.getValue() as number;
      const isGain = value >= 0;
      return (
        <span className={isGain ? 'text-green-400' : 'text-red-400'}> {formatCurrency(value)} </span>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.original.gainLoss;
      if (filterValue === 'gain') return value >= 0;
      if (filterValue === 'loss') return value < 0;
      return true;
    }
  }),
  columnHelper.accessor('marketData.peRatio', {
    header: 'P/E Ratio',
    cell: (info) => (info.getValue() ? (info.getValue() as number).toFixed(2) : 'N/A')
  }),
  columnHelper.accessor('marketData.latestEarnings', {
    header: 'Latest Earnings (EPS)',
    cell: (info) => info.getValue() ?? 'N/A'
  })
];

type PortfolioTableProps = {
  data: PortfolioStock[];
};

export default function PortfolioTable({ data }: PortfolioTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, sorting },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3"> Holdings </h2>
      <div className="glass-effect no-scrollbar">
        <TableFilters table={table} />
        <div className="overflow-x-auto p-2 no-scrollbar">
          <table className="w-full min-w-[1200px] text-xs text-left">
            <thead className="border-b-2 border-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        className={`p-2 font-semibold whitespace-nowrap text-gray-400 tracking-wider ${isSortable ? 'cursor-pointer select-none' : ''}`}
                        onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                      >
                        {header.isPlaceholder
                          ? null
                          : (
                            <span className="flex items-center gap-1">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {isSortable && (
                                <span> {sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▼' : ''} </span>
                              )}
                            </span>
                          )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="bg-transparent border-b border-gray-800 last:border-b-0 transition-colors duration-200 hover:bg-gray-800/60"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
