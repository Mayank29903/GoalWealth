'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

  return Math.max(0, Math.min(MAX_CHART_VALUE, numericValue));
};

const formatAxisValue = (value) => {
  const absValue = Math.abs(value);
  const compact = (num) => num.toFixed(1).replace(/\.0$/, '');

  if (absValue >= 1e12) return `${compact(value / 1e12)}T`;
  if (absValue >= 1e7) return `${compact(value / 1e7)}Cr`;
  if (absValue >= 1e5) return `${compact(value / 1e5)}L`;
  if (absValue >= 1e3) return `${compact(value / 1e3)}K`;
  return `${Math.round(value)}`;
};

const InflationImpactChart = ({
  presentCost,
  inflatedCost,
  inflationRate,
  yearsToGoal,
}) => {
  const safePresentCost = toSafeChartValue(presentCost);
  const safeInflatedCost = toSafeChartValue(inflatedCost);

  const chartData = [
    { label: 'Present Goal Cost', value: safePresentCost, color: '#224c87' },
    { label: 'Inflation Adjusted Goal Cost', value: safeInflatedCost, color: '#b42318' },
  ];

  const inflationLift =
    safePresentCost > 0
      ? ((safeInflatedCost - safePresentCost) / safePresentCost) * 100
      : 0;

  return (
    <section
      className="ui-card rounded-xl p-4"
      aria-labelledby="inflation-impact-heading"
    >
      <h3 id="inflation-impact-heading" className="text-base font-bold text-primary_blue">
        Inflation Impact Visualization
      </h3>
      <p className="mt-1 text-xs text-text_secondary">
        Inflation {inflationRate}% over {yearsToGoal} years increases your target goal amount.
      </p>

      <figure
        className="mt-3"
        aria-labelledby="inflation-chart-caption"
        aria-describedby="inflation-chart-summary"
      >
        <figcaption id="inflation-chart-caption" className="sr-only">
          Bar chart comparing present goal cost and inflation adjusted goal cost.
        </figcaption>
        <p id="inflation-chart-summary" className="sr-only">
          Present cost is {formatCurrency(safePresentCost)} and inflation adjusted cost is{' '}
          {formatCurrency(safeInflatedCost)}.
        </p>

        <div className="h-56 w-full" role="img" aria-label="Inflation impact bar chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe7f7" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#475569', fontSize: 11 }}
                interval={0}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                tickFormatter={formatAxisValue}
                width={68}
                tick={{ fill: '#475569', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={72} isAnimationActive={false}>
                {chartData.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs">
        <div className="ui-subcard rounded-md px-2.5 py-2">
          <p className="text-text_secondary">Present Cost</p>
          <p className="mt-0.5 font-semibold text-primary_blue">{formatCurrency(safePresentCost)}</p>
        </div>
        <div className="ui-subcard rounded-md px-2.5 py-2">
          <p className="text-text_secondary">Inflation-Adjusted Cost</p>
          <p className="mt-0.5 font-semibold text-accent_red">{formatCurrency(safeInflatedCost)}</p>
        </div>
      </div>

      <p className="mt-2 text-xs text-text_secondary">
        Inflation lift:{' '}
        <span className="font-semibold text-text_primary">
          {new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(inflationLift)}
          %
        </span>
      </p>
    </section>
  );
};

export default InflationImpactChart;
