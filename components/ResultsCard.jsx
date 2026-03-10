import React from 'react';
import { formatCurrency } from '@/utils/financialHelpers';

const ResultsCard = ({ results, goalName }) => {
  return (
    <section className="bg-primary_blue text-white p-6 rounded-lg shadow-md" aria-label="Calculation Results">
      <h2 className="text-xl font-bold mb-1 opacity-90">Results for: {goalName}</h2>
      <p className="text-sm mb-6 opacity-75">Based on your inputs and assumptions</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 p-4 rounded backdrop-blur-sm">
          <p className="text-sm opacity-80 mb-1">Required Monthly Investment</p>
          <p className="text-3xl font-bold tracking-tight">
            {formatCurrency(results.requiredMonthlySIP)}
          </p>
        </div>
        
        <div className="bg-white/10 p-4 rounded backdrop-blur-sm">
          <p className="text-sm opacity-80 mb-1">Future Goal Value</p>
          <p className="text-3xl font-bold tracking-tight">
            {formatCurrency(results.inflatedGoalValue)}
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded backdrop-blur-sm">
          <p className="text-sm opacity-80 mb-1">Total Amount Invested</p>
          <p className="text-xl font-semibold">
            {formatCurrency(results.totalInvestedAmount)}
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded backdrop-blur-sm">
          <p className="text-sm opacity-80 mb-1">Estimated Returns</p>
          <p className="text-xl font-semibold text-accent_red bg-white/20 inline-block px-2 rounded">
            {formatCurrency(results.estimatedReturns)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsCard;