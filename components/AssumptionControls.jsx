'use client';

import React from 'react';
import { sanitizeNumber } from '@/utils/financialHelpers';

const AssumptionControls = ({ goal, onFieldChange }) => {
  if (!goal) return null;

  const inflationRate = sanitizeNumber(goal.inflationRate);
  const expectedReturn = sanitizeNumber(goal.expectedReturn);
  const healthSipThresholdPct = sanitizeNumber(goal.healthSipThresholdPct);
  const healthShortHorizonYears = sanitizeNumber(goal.healthShortHorizonYears);
  const healthSafetyGapPct = sanitizeNumber(goal.healthSafetyGapPct);
  const isInflationInvalid = inflationRate < 0 || inflationRate > 20;
  const isReturnInvalid = expectedReturn < 0 || expectedReturn > 30;
  const isHealthSipThresholdInvalid =
    healthSipThresholdPct < 20 || healthSipThresholdPct > 80;
  const isHealthShortHorizonInvalid =
    healthShortHorizonYears < 2 || healthShortHorizonYears > 15;
  const isHealthSafetyGapInvalid = healthSafetyGapPct < 0 || healthSafetyGapPct > 8;

  return (
    <section
      className="ui-card rounded-xl p-5 sm:p-6"
      role="region"
      aria-labelledby="assumptions-heading"
    >
      <h2 id="assumptions-heading" className="mb-4 text-xl font-bold text-primary_blue">
        Financial Assumptions
      </h2>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <fieldset className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <legend className="sr-only">Financial assumption inputs</legend>
          <div>
            <label htmlFor="inflation" className="block text-sm font-medium text-text_secondary mb-1">
              Expected Inflation Rate (% p.a.)
            </label>
            <input
              id="inflation"
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={goal.inflationRate}
              onChange={(e) => onFieldChange('inflationRate', e.target.value)}
              className={`w-full rounded border p-2 text-text_primary transition-colors focus:border-primary_blue focus:ring-2 focus:ring-primary_blue ${
                isInflationInvalid ? 'border-accent_red' : 'border-[#91909080]'
              }`}
              inputMode="decimal"
              required
              aria-invalid={isInflationInvalid}
              aria-describedby={isInflationInvalid ? 'inflation-help inflation-error' : 'inflation-help'}
              aria-errormessage={isInflationInvalid ? 'inflation-error' : undefined}
              aria-label="Expected inflation rate"
            />
            <p id="inflation-help" className="text-xs text-neutral_grey mt-1">
              Inflation assumption: used only to inflate present goal cost into future value.
            </p>
            {isInflationInvalid ? (
              <p id="inflation-error" className="mt-1 text-xs font-medium text-[#7a271a]" role="alert">
                Inflation rate must be between 0% and 20%.
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="return" className="block text-sm font-medium text-text_secondary mb-1">
              Expected Return Rate (% p.a.)
            </label>
            <input
              id="return"
              type="number"
              min="0"
              max="30"
              step="0.1"
              value={goal.expectedReturn}
              onChange={(e) => onFieldChange('expectedReturn', e.target.value)}
              className={`w-full rounded border p-2 text-text_primary transition-colors focus:border-primary_blue focus:ring-2 focus:ring-primary_blue ${
                isReturnInvalid ? 'border-accent_red' : 'border-[#91909080]'
              }`}
              inputMode="decimal"
              required
              aria-invalid={isReturnInvalid}
              aria-describedby={isReturnInvalid ? 'return-help return-error' : 'return-help'}
              aria-errormessage={isReturnInvalid ? 'return-error' : undefined}
              aria-label="Expected return rate"
            />
            <p id="return-help" className="text-xs text-neutral_grey mt-1">
              Return assumption: used only for investment growth to calculate monthly SIP.
            </p>
            {isReturnInvalid ? (
              <p id="return-error" className="mt-1 text-xs font-medium text-[#7a271a]" role="alert">
                Return rate must be between 0% and 30%.
              </p>
            ) : null}
          </div>
        </fieldset>

        <fieldset className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <legend className="text-sm font-semibold text-primary_blue">
            Financial Health Score Assumptions
          </legend>

          <div>
            <label htmlFor="healthSipThreshold" className="mb-1 block text-sm font-medium text-text_secondary">
              Comfortable SIP Load (% income)
            </label>
            <input
              id="healthSipThreshold"
              type="number"
              min="20"
              max="80"
              step="1"
              value={goal.healthSipThresholdPct}
              onChange={(e) => onFieldChange('healthSipThresholdPct', e.target.value)}
              className={`w-full rounded border p-2 text-text_primary transition-colors focus:border-primary_blue focus:ring-2 focus:ring-primary_blue ${
                isHealthSipThresholdInvalid ? 'border-accent_red' : 'border-[#91909080]'
              }`}
              inputMode="numeric"
              aria-invalid={isHealthSipThresholdInvalid}
              aria-describedby={
                isHealthSipThresholdInvalid
                  ? 'healthSipThreshold-help healthSipThreshold-error'
                  : 'healthSipThreshold-help'
              }
            />
            <p id="healthSipThreshold-help" className="mt-1 text-xs text-neutral_grey">
              Rule trigger for SIP affordability pressure in score.
            </p>
            {isHealthSipThresholdInvalid ? (
              <p id="healthSipThreshold-error" className="mt-1 text-xs font-medium text-[#7a271a]" role="alert">
                Value must be between 20 and 80.
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="healthShortHorizon" className="mb-1 block text-sm font-medium text-text_secondary">
              Short Horizon Threshold (years)
            </label>
            <input
              id="healthShortHorizon"
              type="number"
              min="2"
              max="15"
              step="1"
              value={goal.healthShortHorizonYears}
              onChange={(e) => onFieldChange('healthShortHorizonYears', e.target.value)}
              className={`w-full rounded border p-2 text-text_primary transition-colors focus:border-primary_blue focus:ring-2 focus:ring-primary_blue ${
                isHealthShortHorizonInvalid ? 'border-accent_red' : 'border-[#91909080]'
              }`}
              inputMode="numeric"
              aria-invalid={isHealthShortHorizonInvalid}
              aria-describedby={
                isHealthShortHorizonInvalid
                  ? 'healthShortHorizon-help healthShortHorizon-error'
                  : 'healthShortHorizon-help'
              }
            />
            <p id="healthShortHorizon-help" className="mt-1 text-xs text-neutral_grey">
              Minimum comfortable timeline for lower execution stress.
            </p>
            {isHealthShortHorizonInvalid ? (
              <p id="healthShortHorizon-error" className="mt-1 text-xs font-medium text-[#7a271a]" role="alert">
                Value must be between 2 and 15 years.
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="healthSafetyGap" className="mb-1 block text-sm font-medium text-text_secondary">
              Return Safety Gap (%)
            </label>
            <input
              id="healthSafetyGap"
              type="number"
              min="0"
              max="8"
              step="0.5"
              value={goal.healthSafetyGapPct}
              onChange={(e) => onFieldChange('healthSafetyGapPct', e.target.value)}
              className={`w-full rounded border p-2 text-text_primary transition-colors focus:border-primary_blue focus:ring-2 focus:ring-primary_blue ${
                isHealthSafetyGapInvalid ? 'border-accent_red' : 'border-[#91909080]'
              }`}
              inputMode="decimal"
              aria-invalid={isHealthSafetyGapInvalid}
              aria-describedby={
                isHealthSafetyGapInvalid
                  ? 'healthSafetyGap-help healthSafetyGap-error'
                  : 'healthSafetyGap-help'
              }
            />
            <p id="healthSafetyGap-help" className="mt-1 text-xs text-neutral_grey">
              Required buffer between return and inflation assumptions.
            </p>
            {isHealthSafetyGapInvalid ? (
              <p id="healthSafetyGap-error" className="mt-1 text-xs font-medium text-[#7a271a]" role="alert">
                Value must be between 0 and 8.
              </p>
            ) : null}
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default AssumptionControls;
