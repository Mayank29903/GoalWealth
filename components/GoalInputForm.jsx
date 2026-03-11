'use client';

import React from 'react';
import { sanitizeNumber } from '@/utils/financialHelpers';

const GoalInputForm = ({ goal, onFieldChange }) => {
  if (!goal) return null;

  const isGoalNameMissing = !goal.goalName?.trim();
  const isCurrentCostMissing = sanitizeNumber(goal.currentCost) <= 0;
  const isTimelineMissing = sanitizeNumber(goal.yearsToGoal) < 1;
  const isMonthlyIncomeMissing = sanitizeNumber(goal.monthlyIncome) <= 0;

  return (
    <section
      id="goal-details-section"
      className="ui-card rounded-xl p-5 sm:p-6"
      role="region"
      aria-labelledby="goal-details-heading"
    >
      <h2 id="goal-details-heading" className="mb-4 text-xl font-bold text-primary_blue">
        Goal Details
      </h2>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <fieldset className="space-y-4">
          <legend className="sr-only">Goal information form</legend>
          <div>
            <label htmlFor="goalName" className="block text-sm font-medium text-text_secondary mb-1">
              Goal Name
            </label>
            <input
              id="goalName"
              type="text"
              value={goal.goalName}
              onChange={(e) => onFieldChange('goalName', e.target.value)}
              className={`w-full rounded border p-2 text-text_primary transition-colors focus:border-primary_blue focus:ring-2 focus:ring-primary_blue ${
                isGoalNameMissing ? 'border-accent_red' : 'border-[#91909080]'
              }`}
              placeholder="e.g., Retirement, House, Education"
              required
              aria-label="Goal name"
              aria-invalid={isGoalNameMissing}
              aria-describedby={isGoalNameMissing ? 'goalName-help goalName-error' : 'goalName-help'}
              aria-errormessage={isGoalNameMissing ? 'goalName-error' : undefined}
            />
            <p id="goalName-help" className="mt-1 text-xs text-neutral_grey">
              Enter a clear goal title for reporting and comparison.
            </p>
            {isGoalNameMissing ? (
              <p id="goalName-error" className="mt-1 text-xs font-medium text-[#7a271a]" role="alert">
                Goal name is required.
              </p>
            ) : null}
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
              onChange={(e) => onFieldChange('currentCost', e.target.value)}
              className={`w-full rounded border p-2 text-text_primary transition-colors focus:border-primary_blue focus:ring-2 focus:ring-primary_blue ${
                isCurrentCostMissing ? 'border-accent_red' : 'border-[#91909080]'
              }`}
              inputMode="numeric"
              required
              aria-label="Present cost of goal"
              aria-invalid={isCurrentCostMissing}
              aria-describedby={isCurrentCostMissing ? 'currentCost-help currentCost-error' : 'currentCost-help'}
              aria-errormessage={isCurrentCostMissing ? 'currentCost-error' : undefined}
            />
            <p id="currentCost-help" className="mt-1 text-xs text-neutral_grey">
              Must be greater than 0 to compute target corpus and SIP.
            </p>
            {isCurrentCostMissing ? (
              <p id="currentCost-error" className="mt-1 text-xs font-medium text-[#7a271a]" role="alert">
                Present cost must be greater than 0.
              </p>
            ) : null}
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
              onChange={(e) => onFieldChange('yearsToGoal', e.target.value)}
              className={`w-full rounded border p-2 text-text_primary transition-colors focus:border-primary_blue focus:ring-2 focus:ring-primary_blue ${
                isTimelineMissing ? 'border-accent_red' : 'border-[#91909080]'
              }`}
              inputMode="numeric"
              required
              aria-label="Years to achieve goal"
              aria-invalid={isTimelineMissing}
              aria-describedby={isTimelineMissing ? 'years-help years-error' : 'years-help'}
              aria-errormessage={isTimelineMissing ? 'years-error' : undefined}
            />
            <p id="years-help" className="mt-1 text-xs text-neutral_grey">
              Enter 1 to 50 years.
            </p>
            {isTimelineMissing ? (
              <p id="years-error" className="mt-1 text-xs font-medium text-[#7a271a]" role="alert">
                Years to goal must be at least 1.
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="monthlyIncome" className="block text-sm font-medium text-text_secondary mb-1">
              Estimated Monthly Income
            </label>
            <input
              id="monthlyIncome"
              type="number"
              min="0"
              max="1000000000"
              value={goal.monthlyIncome}
              onChange={(e) => onFieldChange('monthlyIncome', e.target.value)}
              className="w-full rounded border border-[#91909080] p-2 text-text_primary transition-colors focus:border-primary_blue focus:ring-2 focus:ring-primary_blue"
              inputMode="numeric"
              aria-label="Estimated monthly income"
              aria-describedby={isMonthlyIncomeMissing ? 'monthlyIncome-help monthlyIncome-info' : 'monthlyIncome-help'}
            />
            <p id="monthlyIncome-help" className="mt-1 text-xs text-neutral_grey">
              Used for Financial Health Score affordability check (SIP vs income).
            </p>
            {isMonthlyIncomeMissing ? (
              <p id="monthlyIncome-info" className="mt-1 text-xs text-text_secondary">
                Recommended: add income to unlock full Financial Health Score accuracy.
              </p>
            ) : null}
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default GoalInputForm;

