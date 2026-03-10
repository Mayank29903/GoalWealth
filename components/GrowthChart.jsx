'use client';

import React from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '@/utils/financialHelpers';

const MAX_CHART_VALUE = 1e15;

const toSafeChartValue = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;

  return Math.max(-MAX_CHART_VALUE, Math.min(MAX_CHART_VALUE, numericValue));
};

const formatAxisValue = (value) => {
  const safeValue = toSafeChartValue(value);
  const absValue = Math.abs(safeValue);
  const compact = (num) => num.toFixed(1).replace(/\.0$/, '');

  if (absValue >= 1e12) return `${compact(safeValue / 1e12)}T`;
  if (absValue >= 1e7) return `${compact(safeValue / 1e7)}Cr`;
  if (absValue >= 1e5) return `${compact(safeValue / 1e5)}L`;
  if (absValue >= 1e3) return `${compact(safeValue / 1e3)}K`;
  return `${Math.round(safeValue)}`;
};

const GrowthTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded border border-[#9190904d] bg-white p-4 text-sm shadow-lg">
        <p className="mb-2 font-bold text-primary_blue">Year {label}</p>
        <p className="mb-1 text-text_secondary">
          Invested: {formatCurrency(payload[0]?.value || 0)}
        </p>
        <p className="mb-1 text-accent_red">
          Estimated Returns: {formatCurrency(payload[1]?.value || 0)}
        </p>
        <p className="font-bold text-primary_blue">
          Total Corpus: {formatCurrency(payload[2]?.value || 0)}
        </p>
      </div>
    );
  }

  return null;
};

const GrowthChart = ({ data }) => {
  const safeData = Array.isArray(data)
    ? data.map((point) => ({
        ...point,
        invested: toSafeChartValue(point?.invested),
        returns: toSafeChartValue(point?.returns),
        corpus: toSafeChartValue(point?.corpus),
      }))
    : [];

  return (
    <div className="h-96 w-full" role="img" aria-label="Investment growth line chart">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={safeData}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
            stroke="#64748b"
          />
          <YAxis
            tickFormatter={formatAxisValue}
            stroke="#64748b"
            width={84}
          />
          <Tooltip content={<GrowthTooltip />} />
          <Legend />
          <Area
            type="linear"
            dataKey="invested"
            fill="#919090"
            stroke="#919090"
            fillOpacity={0.2}
            name="Total Invested"
            isAnimationActive={false}
          />
          <Area
            type="linear"
            dataKey="returns"
            fill="#da3832"
            stroke="#da3832"
            fillOpacity={0.22}
            name="Estimated Returns"
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="corpus"
            stroke="#224c87"
            strokeWidth={3}
            dot={false}
            name="Total Corpus"
            activeDot={{ r: 6 }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthChart;

