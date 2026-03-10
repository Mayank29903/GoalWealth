import React from 'react';
import { formatCurrency } from '@/utils/financialHelpers';

const ResultsCard = ({ results, goalName }) => {
  return (
    <section className="bg-primary_blue text-white p-6 rounded-lg shadow-md" aria-label="Calculation Results">
      <h2 className="text-xl font-bold mb-1 opacity-90">Results for: {goalName}</h2>
      <p className="text-sm mb-6 opacity-75">Based on your inputs and assumptions</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="min-w-0 bg-[#ffffff1a] p-4 rounded backdrop-blur-sm">
          <p className="text-sm opacity-80 mb-1">Required Monthly Investment</p>
          <p className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight break-all [overflow-wrap:anywhere]">
            {formatCurrency(results.requiredMonthlySIP)}
          </p>
        </div>
        
        <div className="min-w-0 bg-[#ffffff1a] p-4 rounded backdrop-blur-sm">
          <p className="text-sm opacity-80 mb-1">Future Goal Value</p>
          <p className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight break-all [overflow-wrap:anywhere]">
            {formatCurrency(results.inflatedGoalValue)}
          </p>
        </div>

        <div className="min-w-0 bg-[#ffffff1a] p-4 rounded backdrop-blur-sm">
          <p className="text-sm opacity-80 mb-1">Total Amount Invested</p>
          <p className="text-xl font-semibold leading-tight break-all [overflow-wrap:anywhere]">
            {formatCurrency(results.totalInvestedAmount)}
          </p>
        </div>

        <div className="min-w-0 bg-[#ffffff1a] p-4 rounded backdrop-blur-sm">
          <p className="text-sm opacity-80 mb-1">Estimated Returns</p>
          <p className="text-xl font-semibold text-accent_red bg-[#ffffff33] inline-block max-w-full px-2 rounded leading-tight break-all [overflow-wrap:anywhere]">
            {formatCurrency(results.estimatedReturns)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsCard;
