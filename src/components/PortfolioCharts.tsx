'use client';

import React from 'react';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Sector } from 'recharts';
import type { PortfolioStock } from '@/types/portfolio';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (Math.abs(value) >= 1_00_000) {
    return `₹${(value / 1_00_000).toFixed(2)} L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
};

// Define types for custom shape props
interface ActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: { name: string };
  percent?: number;
  value: number;
}

interface RoundedBarProps {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  fill: string;
}

// Accept 'any' for recharts compatibility, but type inside
const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props as ActiveShapeProps;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
        {payload.name.replace(/ Sector$/, '')}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff">{`${((percent ?? 0) * 100).toFixed(2)}%`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {formatCurrency(value)}
      </text>
    </g>
  );
};

const RoundedBar = (props: any): React.ReactElement => {
  const { fill, x, y, width, height } = props as RoundedBarProps;
  const radius = 6;
  return (
    <path d={`M${x},${y + radius} A${radius},${radius} 0 0 1 ${x + radius},${y} L${x + width - radius},${y} A${radius},${radius} 0 0 1 ${x + width},${y + radius} L${x + width},${height + y} L${x},${height + y} Z`} fill={fill} />
  );
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  // Type payload inside for safety
  const typedPayload = payload as TooltipPayloadItem[];
  if (active && typedPayload && typedPayload.length) {
    return (
      <div className="p-2 glass-effect text-sm">
        <p className="label font-bold text-white">{`${label}`}</p>
        {typedPayload.map((pld, index) => (
          <p key={index} style={{ color: pld.fill }}> {`${pld.name}: ${formatCurrency(pld.value)}`} </p>
        ))}
      </div>
    );
  }
  return null;
};

type PortfolioChartsProps = {
  data: PortfolioStock[];
};

export default function PortfolioCharts({ data }: PortfolioChartsProps) {
  const sectorData = useMemo(() => {
    const sectorMap: { [key: string]: number } = {};
    data.forEach((stock) => {
      sectorMap[stock.sector] = (sectorMap[stock.sector] || 0) + stock.investment;
    });
    return Object.entries(sectorMap).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Visualizations</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 glass-effect min-h-[400px]">
          <h3 className="text-lg font-bold text-white mb-4 text-center"> Sector Allocation (by Investment) </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                activeShape={renderActiveShape}
                data={sectorData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {sectorData.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {sectorData.map((entry, index) => (
                <span
                  key={entry.name}
                  className="flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    background: COLORS[index % COLORS.length],
                    color: '#222',
                    opacity: 0.85,
                  }}
                >
                  {entry.name.replace(/ Sector$/, '')}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 glass-effect min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 text-center"> Investment vs. Present Value </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" fontSize={10} angle={-10} textAnchor="end" height={50} />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(136, 132, 216, 0.2)' }} />
              <Legend />
              <Bar dataKey="investment" fill="#8884d8" name="Investment" shape={RoundedBar} />
              <Bar dataKey="presentValue" fill="#82ca9d" name="Present Value" shape={RoundedBar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
