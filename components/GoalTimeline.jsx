import React from 'react';
import { formatCurrency } from '@/utils/financialHelpers';

const GoalTimeline = ({ years, timelineData = [], goalName }) => {
  if (!timelineData.length) return null;

  return (
    <div className="overflow-x-auto pb-2" aria-label="Goal timeline visualization">
      <div className="relative min-w-140 pt-6 pb-2 sm:min-w-0">
        <div className="absolute top-8 left-0 h-1 w-full rounded bg-[#9190904d]"></div>
        <div className="absolute top-8 left-0 h-1 w-full rounded bg-primary_blue"></div>

        <div className="relative flex w-full items-start justify-between gap-2">
          {timelineData.map((marker, index) => {
            const isGoalYear = index === timelineData.length - 1;

            return (
              <article
                key={marker.year}
                className="z-10 flex max-w-32.5 flex-1 flex-col items-center text-center"
              >
                <div
                  className={`h-4 w-4 rounded-full border-2 ${isGoalYear ? 'border-accent_red bg-accent_red' : 'border-primary_blue bg-white'}`}
                  aria-hidden="true"
                ></div>
                <div className="mt-3">
                  <p className="text-sm font-bold text-primary_blue">Year {marker.year}</p>
                  <p className="text-xs text-text_secondary">{marker.stageLabel}</p>
                  <p className="mt-1 text-xs font-semibold text-text_primary">
                    {formatCurrency(marker.corpus)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-text_secondary">
        <p>
          {goalName}: {years} year roadmap
        </p>
      </div>
    </div>
  );
};

export default GoalTimeline;

