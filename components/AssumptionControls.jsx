'use client';

import React from 'react';
import { sanitizeNumber } from '@/utils/financialHelpers';

const AssumptionControls = ({ goal, onFieldChange }) => {
  if (!goal) return null;

  const inflationRate = sanitizeNumber(goal.inflationRate);
  const expectedReturn = sanitizeNumber(goal.expectedReturn);
  const isInflationInvalid = inflationRate < 0 || inflationRate > 20;
  const isReturnInvalid = expectedReturn < 0 || expectedReturn > 30;

  return (
    <section
      className="rounded-xl border border-[#9190904d] bg-card_background p-5 shadow-sm sm:p-6"
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
                isInflationInvalid ? 'border-[#b42318]' : 'border-[#91909080]'
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
                isReturnInvalid ? 'border-[#b42318]' : 'border-[#91909080]'
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
      </form>
    </section>
  );
};

export default AssumptionControls;

