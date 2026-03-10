'use client';

import React from 'react';
import { formatCurrency, formatPercentage } from '@/utils/financialHelpers';

const formatMultiplier = (value) =>
  `${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}x`;

const toneClasses = {
  Balanced: 'border-[#224c8733] bg-[#224c870f] text-primary_blue',
  Conservative: 'border-[#7a4a1540] bg-[#fef3e2] text-[#7a4a15]',
  Challenging: 'border-[#b4231840] bg-[#fff1f2] text-[#7a271a]',
  'Tight Timeline': 'border-[#7a4a1540] bg-[#fef3e2] text-[#7a4a15]',
};

const GoalInsightsPanel = ({ insights }) => {
  if (!insights) return null;

  const metrics = [
    {
      label: 'Inflation-Adjusted Return',
      value: formatPercentage(insights.realReturn),
      helper: 'Real return after inflation',
    },
    {
      label: 'Annual SIP Requirement',
      value: formatCurrency(insights.annualSIP),
      helper: 'Monthly SIP x 12',
    },
    {
      label: 'Goal Cost Growth',
      value: formatMultiplier(insights.goalGrowthMultiple),
      helper: 'Future value vs today cost',
    },
    {
      label: 'Contribution Share',
      value: formatPercentage(insights.contributionShare),
      helper: 'Invested capital as % of goal',
    },
  ];

  return (
    <section
      className="rounded-xl border border-[#9190904d] bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="goal-insights-heading"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 id="goal-insights-heading" className="text-xl font-bold text-primary_blue">
          Smart Goal Insights
        </h3>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text_secondary">
          {insights.horizonBand}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-lg border border-[#91909033] bg-card_background p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-text_secondary">
              {metric.label}
            </p>
            <p className="mt-1 text-xl font-bold text-primary_blue">{metric.value}</p>
            <p className="mt-1 text-xs text-text_secondary">{metric.helper}</p>
          </article>
        ))}
      </div>

      <div
        className={`mt-4 rounded-lg border p-4 text-sm ${toneClasses[insights.guidanceTone]}`}
        role="status"
      >
        <p className="font-semibold">Guidance: {insights.guidanceTone}</p>
        <p className="mt-1 leading-relaxed">{insights.guidanceMessage}</p>
      </div>
    </section>
  );
};

export default GoalInsightsPanel;
