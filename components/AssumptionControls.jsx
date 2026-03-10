'use client';

import React from 'react';
import { sanitizeNumber } from '@/utils/financialHelpers';

const AssumptionControls = ({
  inflationRate,
  expectedReturn,
  onInflationChange,
  onReturnChange,
}) => {
  return (
    <section className="bg-card_background p-6 rounded-lg shadow-sm border border-neutral_grey/30" aria-label="Financial Assumptions">
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
            value={inflationRate}
            onChange={(e) => onInflationChange(sanitizeNumber(e.target.value))}
            className="w-full p-2 border border-neutral_grey/50 rounded focus:ring-2 focus:ring-primary_blue focus:border-primary_blue transition-colors text-text_primary"
            aria-describedby="inflation-help"
          />
          <p id="inflation-help" className="text-xs text-neutral_grey mt-1">
            Average annual increase in cost of goods.
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
            value={expectedReturn}
            onChange={(e) => onReturnChange(sanitizeNumber(e.target.value))}
            className="w-full p-2 border border-neutral_grey/50 rounded focus:ring-2 focus:ring-primary_blue focus:border-primary_blue transition-colors text-text_primary"
            aria-describedby="return-help"
          />
          <p id="return-help" className="text-xs text-neutral_grey mt-1">
            Estimated annual growth of investment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AssumptionControls;