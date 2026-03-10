'use client';

import React from 'react';
import { sanitizeNumber } from '@/utils/financialHelpers';

const GoalInputForm = ({ goal, onFieldChange }) => {
  if (!goal) return null;

  return (
    <section className="bg-card_background p-6 rounded-lg shadow-sm border border-[#9190904d]" aria-label="Goal Details">
      <h2 className="text-xl font-bold text-primary_blue mb-4">Goal Details</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="goalName" className="block text-sm font-medium text-text_secondary mb-1">
            Goal Name
          </label>
          <input
            id="goalName"
            type="text"
            value={goal.goalName}
            onChange={(e) => onFieldChange('goalName', e.target.value)}
            className="w-full p-2 border border-[#91909080] rounded focus:ring-2 focus:ring-primary_blue focus:border-primary_blue transition-colors text-text_primary"
            placeholder="e.g., Retirement, House, Education"
            aria-label="Goal name"
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
            max="10000000000000"
            value={goal.currentCost}
            onChange={(e) => onFieldChange('currentCost', sanitizeNumber(e.target.value))}
            className="w-full p-2 border border-[#91909080] rounded focus:ring-2 focus:ring-primary_blue focus:border-primary_blue transition-colors text-text_primary"
            aria-label="Present cost of goal"
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
            value={goal.yearsToGoal}
            onChange={(e) => onFieldChange('yearsToGoal', sanitizeNumber(e.target.value))}
            className="w-full p-2 border border-[#91909080] rounded focus:ring-2 focus:ring-primary_blue focus:border-primary_blue transition-colors text-text_primary"
            aria-label="Years to achieve goal"
          />
        </div>
      </div>
    </section>
  );
};

export default GoalInputForm;

