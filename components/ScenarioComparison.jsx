'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency, formatPercentage } from '@/utils/financialHelpers';

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

const ScenarioComparison = ({ scenarios = [] }) => {
  const safeScenarios = scenarios.map((scenario) => ({
    ...scenario,
    requiredMonthlySIP: toSafeChartValue(scenario?.requiredMonthlySIP),
    totalInvestedAmount: toSafeChartValue(scenario?.totalInvestedAmount),
    estimatedReturns: toSafeChartValue(scenario?.estimatedReturns),
    inflatedGoalValue: toSafeChartValue(scenario?.inflatedGoalValue),
  }));

  const scenarioSummary = safeScenarios.length
    ? `Scenario chart compares monthly SIP across ${safeScenarios.length} return assumptions, from ${safeScenarios[0].returnRate}% to ${safeScenarios[safeScenarios.length - 1].returnRate}%.`
    : 'No scenario data available.';

  return (
    <section
      className="ui-card rounded-xl p-5 sm:p-6"
      aria-label="Scenario comparison"
    >
      <h2 className="text-xl font-bold text-primary_blue">Scenario Comparison</h2>
      <p className="mt-1 text-sm text-text_secondary">
        Compare required SIP for different return assumptions.
      </p>

      <figure className="mt-6" aria-labelledby="scenario-chart-caption" aria-describedby="scenario-chart-summary">
        <figcaption id="scenario-chart-caption" className="mb-2 text-sm font-medium text-text_secondary">
          Required SIP at different annual return assumptions.
        </figcaption>
        <p id="scenario-chart-summary" className="sr-only">
          {scenarioSummary}
        </p>
        <div className="h-72 w-full" role="img" aria-label="Scenario comparison bar chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safeScenarios} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
              <XAxis dataKey="returnRate" tickFormatter={(v) => `${v}%`} stroke="#919090" />
              <YAxis tickFormatter={formatAxisValue} stroke="#919090" width={84} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Return ${label}%`}
              />
              <Bar
                dataKey="requiredMonthlySIP"
                name="Monthly SIP"
                fill="#224c87"
                radius={[8, 8, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {safeScenarios.map((scenario) => (
          <article
            key={scenario.returnRate}
            className="ui-subcard rounded-md p-4"
          >
            <h3 className="font-semibold text-primary_blue">
              Return {formatPercentage(scenario.returnRate)}
            </h3>
            <p className="mt-2 text-xs text-text_secondary">Required SIP</p>
            <p className="text-lg font-bold leading-tight text-text_primary break-all [overflow-wrap:anywhere]">
              {formatCurrency(scenario.requiredMonthlySIP)}
            </p>
            <p className="mt-3 text-xs text-text_secondary">Estimated Returns</p>
            <p className="font-semibold leading-tight text-accent_red break-all [overflow-wrap:anywhere]">
              {formatCurrency(scenario.estimatedReturns)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ScenarioComparison;

