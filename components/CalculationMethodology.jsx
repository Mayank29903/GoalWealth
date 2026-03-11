'use client';

import React from 'react';
import { formatCurrency } from '@/utils/financialHelpers';

const toSafeNumber = (value, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const formatRate = (value, maxFractionDigits = 2) =>
  new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  }).format(toSafeNumber(value));

const formatDecimal = (value, maxFractionDigits = 6) =>
  new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  }).format(toSafeNumber(value));

const CalculationMethodology = ({ goal, results }) => {
  const presentCost = toSafeNumber(goal?.currentCost);
  const yearsToGoal = Math.max(1, Math.round(toSafeNumber(goal?.yearsToGoal, 1)));
  const inflationRate = toSafeNumber(goal?.inflationRate);
  const expectedReturn = toSafeNumber(goal?.expectedReturn);

  const inflatedGoalValue = toSafeNumber(results?.inflatedGoalValue);
  const requiredMonthlySIP = toSafeNumber(results?.requiredMonthlySIP);

  const monthlyRate = expectedReturn / 1200;
  const totalMonths = yearsToGoal * 12;

  const keyInputs = [
    { label: 'Current Goal Cost', value: formatCurrency(presentCost) },
    { label: 'Goal Timeline', value: `${yearsToGoal} years` },
    { label: 'Inflation Assumption', value: `${formatRate(inflationRate)}%` },
    { label: 'Return Assumption', value: `${formatRate(expectedReturn)}%` },
  ];

  return (
    <section
      className="ui-card rounded-xl p-5 sm:p-6"
      aria-label="Calculation methodology"
    >
      <h2 className="text-xl font-bold text-primary_blue">How This SIP Is Calculated</h2>
      <p className="mt-1 text-sm text-text_secondary">
        The planner follows a two-step method: inflate the goal value first, then calculate the
        monthly SIP needed to reach that value.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {keyInputs.map((input) => (
          <article
            key={input.label}
            className="ui-subcard rounded-lg p-3"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-text_secondary">
              {input.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-primary_blue">{input.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <article className="rounded-md border border-[#224c8733] bg-[#224c870a] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary_blue">
            Step 1 - Inflate Goal Value
          </p>
          <p className="mt-2 text-sm text-text_secondary">
            <span className="font-medium text-text_primary">Formula:</span>{' '}
            <code className="font-semibold">FV = Present Cost x (1 + Inflation rate)^Years</code>
          </p>
          <p className="mt-2 text-sm text-text_secondary break-all wrap-anywhere">
            <span className="font-medium text-text_primary">Applied:</span>{' '}
            {formatCurrency(presentCost)} x (1 + {formatRate(inflationRate)} / 100)^{yearsToGoal}{' '}
            = {formatCurrency(inflatedGoalValue)}
          </p>
        </article>

        <article className="rounded-md border border-[#b4231840] bg-[#b423180d] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent_red">
            Step 2 - Required Monthly SIP
          </p>
          <p className="mt-2 text-sm text-text_secondary">
            <span className="font-medium text-text_primary">Monthly rate:</span>{' '}
            <code>r = Annual return / 1200</code> = {formatRate(expectedReturn)} / 1200 ={' '}
            {formatDecimal(monthlyRate)}
          </p>
          <p className="mt-1 text-sm text-text_secondary">
            <span className="font-medium text-text_primary">Total months:</span>{' '}
            <code>n = Years x 12</code> = {yearsToGoal} x 12 = {totalMonths}
          </p>
          <p className="mt-2 text-sm text-text_secondary">
            <span className="font-medium text-text_primary">Formula:</span>{' '}
            <code className="font-semibold">Required SIP = FV x r / [((1 + r)^n - 1) x (1 + r)]</code>
          </p>
          {monthlyRate > 0 ? (
            <p className="mt-2 text-sm text-text_secondary break-all wrap-anywhere">
              <span className="font-medium text-text_primary">Applied:</span>{' '}
              {formatCurrency(inflatedGoalValue)} x {formatDecimal(monthlyRate)} / [((1 +{' '}
              {formatDecimal(monthlyRate)})^{totalMonths} - 1) x (1 + {formatDecimal(monthlyRate)}
              )] = {formatCurrency(requiredMonthlySIP)}
            </p>
          ) : (
            <p className="mt-2 text-sm text-text_secondary break-all wrap-anywhere">
              <span className="font-medium text-text_primary">Zero-return fallback:</span> when
              return is 0%, SIP = FV / n = {formatCurrency(inflatedGoalValue)} / {totalMonths} ={' '}
              {formatCurrency(requiredMonthlySIP)}
            </p>
          )}
        </article>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-[#224c8733] bg-[#224c870f] p-3">
          <p className="text-sm font-semibold text-primary_blue">Inflation Assumption</p>
          <p className="mt-1 text-xs text-text_secondary">
            Used only in Step 1 to estimate how much your goal cost will grow over time.
          </p>
        </div>
        <div className="rounded-md border border-[#b4231840] bg-[#b4231812] p-3">
          <p className="text-sm font-semibold text-accent_red">Return Assumption</p>
          <p className="mt-1 text-xs text-text_secondary">
            Used only in Step 2 to model investment growth and compute the required monthly SIP.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CalculationMethodology;

