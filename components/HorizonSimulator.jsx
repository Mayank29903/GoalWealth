'use client';

import { useMemo, useState } from 'react';
import { calculateGoalPlan } from '@/utils/goalCalculator';
import { formatCurrency, sanitizeNumber } from '@/utils/financialHelpers';

const MIN_YEARS = 1;
const MAX_YEARS = 30;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatSignedPercentage = (value) => {
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(absValue);

  return `${value >= 0 ? '+' : '-'}${formatted}%`;
};

const HorizonSimulator = ({
  currentCost,
  inflationRate,
  expectedReturn,
  baselineYears,
  baselineSIP,
}) => {
  const safeBaselineYears = clamp(
    Math.round(sanitizeNumber(baselineYears) || MIN_YEARS),
    MIN_YEARS,
    MAX_YEARS
  );
  const [simulatedYears, setSimulatedYears] = useState(safeBaselineYears);

  const simulation = useMemo(
    () =>
      calculateGoalPlan({
        currentCost: sanitizeNumber(currentCost),
        years: simulatedYears,
        inflationRate: sanitizeNumber(inflationRate),
        expectedReturn: sanitizeNumber(expectedReturn),
      }),
    [currentCost, expectedReturn, inflationRate, simulatedYears]
  );

  const safeBaselineSIP = sanitizeNumber(baselineSIP);
  const sipDelta = simulation.requiredMonthlySIP - safeBaselineSIP;
  const sipDeltaPercent =
    safeBaselineSIP > 0 ? (sipDelta / safeBaselineSIP) * 100 : 0;
  const isSipReduced = sipDelta <= 0;

  return (
    <section
      className="ui-card rounded-xl p-4"
      aria-labelledby="horizon-simulator-heading"
    >
      <h3 id="horizon-simulator-heading" className="text-base font-bold text-primary_blue">
        Investment Horizon Simulator
      </h3>
      <p className="mt-1 text-xs text-text_secondary">
        Adjust years and instantly see how required monthly SIP changes.
      </p>

      <div className="ui-subcard mt-3 rounded-lg p-3">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="horizon-simulator-slider"
            className="text-xs font-semibold uppercase tracking-wide text-text_secondary"
          >
            Investment Duration
          </label>
          <output
            htmlFor="horizon-simulator-slider"
            className="rounded-full border border-[#224c8740] bg-[#224c8712] px-2 py-0.5 text-xs font-semibold text-primary_blue"
          >
            {simulatedYears} years
          </output>
        </div>

        <input
          id="horizon-simulator-slider"
          type="range"
          min={MIN_YEARS}
          max={MAX_YEARS}
          step={1}
          value={simulatedYears}
          onChange={(event) => setSimulatedYears(Number(event.target.value))}
          className="mt-3 h-2 w-full cursor-pointer accent-primary_blue"
          aria-label="Adjust investment years from 1 to 30"
        />
        <div className="mt-1 flex items-center justify-between text-[11px] text-text_secondary">
          <span>1y</span>
          <span>15y</span>
          <span>30y</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <article className="ui-subcard rounded-md px-2.5 py-2">
          <p className="text-text_secondary">Simulated SIP</p>
          <p className="mt-0.5 font-semibold text-primary_blue">
            {formatCurrency(simulation.requiredMonthlySIP)}
          </p>
        </article>
        <article className="ui-subcard rounded-md px-2.5 py-2">
          <p className="text-text_secondary">Simulated Goal Value</p>
          <p className="mt-0.5 font-semibold text-text_primary">
            {formatCurrency(simulation.inflatedGoalValue)}
          </p>
        </article>
      </div>

      <p
        className={`mt-3 rounded-md border px-2.5 py-2 text-xs ${
          isSipReduced
            ? 'border-[#15803d33] bg-[#f0fdf4] text-[#14532d]'
            : 'border-[#b4231840] bg-[#fff1f2] text-[#7a271a]'
        }`}
      >
        Compared with current plan ({safeBaselineYears} years): SIP is{' '}
        <span className="font-semibold">
          {isSipReduced ? 'lower' : 'higher'} by {formatSignedPercentage(sipDeltaPercent)}
        </span>{' '}
        ({formatCurrency(Math.abs(sipDelta))}).
      </p>
    </section>
  );
};

export default HorizonSimulator;
