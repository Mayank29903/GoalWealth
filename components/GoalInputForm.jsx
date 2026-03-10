'use client';

import React from 'react';
import { sanitizeNumber } from '@/utils/financialHelpers';

const GoalInputForm = ({
  goalName,
  setGoalName,
  currentCost,
  setCurrentCost,
  yearsToGoal,
  setYearsToGoal,
}) => {
  return (
    <section className="bg-card_background p-6 rounded-lg shadow-sm border border-neutral_grey/30" aria-label="Goal Details">
      <h2 className="text-xl font-bold text-primary_blue mb-4">Goal Details</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="goalName" className="block text-sm font-medium text-text_secondary mb-1">
            Goal Name
          </label>
          <input
            id="goalName"
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="w-full p-2 border border-neutral_grey/50 rounded focus:ring-2 focus:ring-primary_blue focus:border-primary_blue transition-colors text-text_primary"
            placeholder="e.g., Retirement, House, Education"
          />
        </div>
        <div>
          <label htmlFor="currentCost" className="block text-sm font-medium text-text_secondary mb-1">
            Present Cost of Goal
          </label>
          <input
            id="currentCost"
            type="number"
            min="0"
            value={currentCost}
            onChange={(e) => setCurrentCost(sanitizeNumber(e.target.value))}
            className="w-full p-2 border border-neutral_grey/50 rounded focus:ring-2 focus:ring-primary_blue focus:border-primary_blue transition-colors text-text_primary"
          />
        </div>
        <div>
          <label htmlFor="years" className="block text-sm font-medium text-text_secondary mb-1">
            Years to Achieve Goal
          </label>
          <input
            id="years"
            type="number"
            min="1"
            max="50"
            value={yearsToGoal}
            onChange={(e) => setYearsToGoal(sanitizeNumber(e.target.value))}
            className="w-full p-2 border border-neutral_grey/50 rounded focus:ring-2 focus:ring-primary_blue focus:border-primary_blue transition-colors text-text_primary"
          />
        </div>
      </div>
    </section>
  );
};

export default GoalInputForm;