'use client';

import React from 'react';
import { sanitizeNumber } from '@/utils/financialHelpers';

const AssumptionControls = ({ goal, onFieldChange }) => {
  if (!goal) return null;

  return (
    <section className="bg-card_background p-6 rounded-lg shadow-sm border border-[#9190904d]" aria-label="Financial Assumptions">
      <h2 className="text-xl font-bold text-primary_blue mb-4">Financial Assumptions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            onChange={(e) => onFieldChange('inflationRate', sanitizeNumber(e.target.value))}
            className="w-full p-2 border border-[#91909080] rounded focus:ring-2 focus:ring-primary_blue focus:border-primary_blue transition-colors text-text_primary"
            aria-describedby="inflation-help"
            aria-label="Expected inflation rate"
          />
          <p id="inflation-help" className="text-xs text-neutral_grey mt-1">
            Inflation assumption: used only to inflate present goal cost into future value.
          </p>
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
            onChange={(e) => onFieldChange('expectedReturn', sanitizeNumber(e.target.value))}
            className="w-full p-2 border border-[#91909080] rounded focus:ring-2 focus:ring-primary_blue focus:border-primary_blue transition-colors text-text_primary"
            aria-describedby="return-help"
            aria-label="Expected return rate"
          />
          <p id="return-help" className="text-xs text-neutral_grey mt-1">
            Return assumption: used only for investment growth to calculate monthly SIP.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AssumptionControls;

