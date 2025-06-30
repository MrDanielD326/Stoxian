'use client';

import { useMemo } from 'react';
import type { Table } from '@tanstack/react-table';
import type { PortfolioStock } from '@/types/portfolio';

type TableFiltersProps = {
  table: Table<PortfolioStock>;
};

const FilterButton = ({ onClick, isActive, children }: { onClick: () => void; isActive: boolean; children: React.ReactNode }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${isActive
          ? 'bg-indigo-500 text-white shadow'
          : 'bg-transparent text-gray-300 hover:bg-gray-700/80'
        }`}
    >
      {children}
    </button>
  );
};

export default function TableFilters({ table }: TableFiltersProps) {
  const sectors = useMemo(() => {
    const uniqueSectors = new Set<string>();
    table.getPreFilteredRowModel().rows.forEach((row) => {
      uniqueSectors.add(row.original.sector);
    });
    return ['All Sectors', ...Array.from(uniqueSectors).sort()];
  }, [table]);

  const particularsFilter = table.getColumn('name')?.getFilterValue() as string | undefined;
  const sectorFilter = table.getColumn('sector')?.getFilterValue() as string | undefined;
  const gainLossFilter = (table.getColumn('gainLoss')?.getFilterValue() as string) ?? 'all';

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 p-4">
      <div className="relative w-full md:w-auto md:flex-grow">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3"> 🔍 </span>
        <input
          type="text"
          value={particularsFilter ?? ''}
          onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
          placeholder="Search Particulars..."
          className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <select
          value={sectorFilter ?? 'All Sectors'}
          onChange={(e) => {
            const value = e.target.value;
            table.getColumn('sector')?.setFilterValue(value === 'All Sectors' ? undefined : value);
          }}
          className="w-full sm:w-auto px-3 py-2 bg-black text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 p-1 bg-gray-900/50 rounded-md border border-gray-700">
          <FilterButton isActive={gainLossFilter === 'all'} onClick={() => table.getColumn('gainLoss')?.setFilterValue(undefined)}>
            All
          </FilterButton>
          <FilterButton isActive={gainLossFilter === 'gain'} onClick={() => table.getColumn('gainLoss')?.setFilterValue('gain')}>
            Gains
          </FilterButton>
          <FilterButton isActive={gainLossFilter === 'loss'} onClick={() => table.getColumn('gainLoss')?.setFilterValue('loss')}>
            Losses
          </FilterButton>
        </div>
      </div>
    </div>
  );
} 