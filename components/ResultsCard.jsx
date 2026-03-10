import React from 'react';
import { formatCurrency } from '@/utils/financialHelpers';

const ResultsCard = ({ results, goalName }) => {
  return (
    <section
      className="rounded-xl bg-primary_blue p-5 text-white shadow-md sm:p-6"
      aria-labelledby="results-heading"
    >
      <h2 id="results-heading" className="mb-1 text-xl font-bold">Results for: {goalName}</h2>
      <p className="mb-6 text-sm text-[#dbe7ff]">Based on your inputs and assumptions</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="min-w-0 bg-[#ffffff1a] p-4 rounded backdrop-blur-sm">
          <p className="mb-1 text-sm text-[#dbe7ff]">Required Monthly Investment</p>
          <p className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight break-all [overflow-wrap:anywhere]">
            {formatCurrency(results.requiredMonthlySIP)}
          </p>
        </div>
        
        <div className="min-w-0 bg-[#ffffff1a] p-4 rounded backdrop-blur-sm">
          <p className="mb-1 text-sm text-[#dbe7ff]">Future Goal Value</p>
          <p className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight break-all [overflow-wrap:anywhere]">
            {formatCurrency(results.inflatedGoalValue)}
          </p>
        </div>

        <div className="min-w-0 bg-[#ffffff1a] p-4 rounded backdrop-blur-sm">
          <p className="mb-1 text-sm text-[#dbe7ff]">Total Amount Invested</p>
          <p className="text-xl font-semibold leading-tight break-all [overflow-wrap:anywhere]">
            {formatCurrency(results.totalInvestedAmount)}
          </p>
        </div>

        <div className="min-w-0 bg-[#ffffff1a] p-4 rounded backdrop-blur-sm">
          <p className="mb-1 text-sm text-[#dbe7ff]">Estimated Returns</p>
          <p className="inline-block max-w-full rounded bg-[#ffffff33] px-2 text-xl font-semibold leading-tight text-[#7a271a] break-all [overflow-wrap:anywhere]">
            {formatCurrency(results.estimatedReturns)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsCard;
