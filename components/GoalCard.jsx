'use client';

import clsx from 'clsx';
import { Target, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/financialHelpers';

const GoalCard = ({
  goal,
  result,
  isConfigured,
  isActive,
  disableRemove,
  onSelect,
  onRemove,
}) => {
  const displayGoalName = goal.goalName?.trim() || 'Untitled Goal';
  const displayHorizon = goal.yearsToGoal ? `${goal.yearsToGoal} year horizon` : 'Set timeline';

  return (
    <article
      className={clsx(
        'rounded-xl border p-4 transition-colors',
        isActive
          ? 'border-primary_blue bg-[#224c870d] shadow-sm'
          : 'border-[#9190904d] bg-white hover:border-[#224c8780]'
      )}
      aria-label={`${displayGoalName} goal card`}
      role="group"
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelect(goal.id)}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
          aria-pressed={isActive}
        >
          <span className="mt-1 rounded-md bg-[#224c871a] p-2 text-primary_blue">
            <Target size={16} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-text_primary">
              {displayGoalName}
            </span>
            <span className="block text-xs text-text_secondary">
              {displayHorizon}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => onRemove(goal.id)}
          disabled={disableRemove}
          className="rounded-md p-2 text-text_secondary transition-colors hover:bg-[#b423181a] hover:text-accent_red disabled:cursor-not-allowed disabled:opacity-45"
          aria-label={`Remove ${displayGoalName}`}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>

      <p
        className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${
          isConfigured
            ? 'bg-[#224c8714] text-primary_blue'
            : 'bg-[#b423181a] text-accent_red'
        }`}
      >
        {isConfigured ? 'Ready For Projection' : 'Needs Required Inputs'}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div className="min-w-0 rounded-md bg-card_background p-2">
          <dt className="text-text_secondary">Monthly SIP</dt>
          <dd className="font-semibold leading-tight text-primary_blue break-all [overflow-wrap:anywhere]">
            {isConfigured ? formatCurrency(result?.requiredMonthlySIP || 0) : '--'}
          </dd>
        </div>
        <div className="min-w-0 rounded-md bg-card_background p-2">
          <dt className="text-text_secondary">Goal Value</dt>
          <dd className="font-semibold leading-tight text-text_primary break-all [overflow-wrap:anywhere]">
            {isConfigured ? formatCurrency(result?.inflatedGoalValue || 0) : '--'}
          </dd>
        </div>
      </dl>
    </article>
  );
};

export default GoalCard;


