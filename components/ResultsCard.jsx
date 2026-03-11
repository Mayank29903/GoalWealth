'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import CountUp from 'react-countup';
import { formatCurrency } from '@/utils/financialHelpers';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const AnimatedCurrency = ({ value, className, duration = 1.25 }) => {
  const shouldReduceMotion = useReducedMotion();
  const safeValue = Number.isFinite(value) ? value : 0;
  const finalText = formatCurrency(safeValue);

  return (
    <p className={className}>
      <span aria-hidden="true" data-export-dynamic="true">
        <CountUp
          start={0}
          end={safeValue}
          duration={shouldReduceMotion ? 0 : duration}
          formattingFn={formatCurrency}
          preserveValue
        />
      </span>
      <span aria-hidden="true" className="export-static-value">
        {finalText}
      </span>
      <span className="sr-only">{finalText}</span>
    </p>
  );
};

const ResultsCard = ({ results, goalName, insights }) => {
  const shouldReduceMotion = useReducedMotion();

  const progressIndicators = useMemo(() => {
    const totalInvested = Number(results?.totalInvestedAmount) || 0;
    const futureValue = Number(results?.inflatedGoalValue) || 0;
    const estimatedReturns = Number(results?.estimatedReturns) || 0;

    const returnContributionShare = futureValue > 0 ? (estimatedReturns / futureValue) * 100 : 0;
    const capitalLoadShare = futureValue > 0 ? (totalInvested / futureValue) * 100 : 100;

    const financialHealthScore = clamp(
      returnContributionShare * 0.7 + (100 - capitalLoadShare) * 0.3 + 22,
      0,
      100
    );

    const fallbackProbability = clamp(
      45 + ((estimatedReturns / Math.max(totalInvested, 1)) * 100) / 3,
      10,
      92
    );

    const realReturn = Number(insights?.realReturn) || 0;
    const horizonBoost =
      insights?.horizonBand === 'Long Horizon'
        ? 8
        : insights?.horizonBand === 'Medium Horizon'
          ? 4
          : 0;
    const toneAdjustment =
      insights?.guidanceTone === 'Challenging'
        ? -20
        : insights?.guidanceTone === 'Conservative'
          ? -10
          : insights?.guidanceTone === 'Tight Timeline'
            ? -12
            : 5;

    const goalProbabilityIndicator = insights
      ? clamp(55 + realReturn * 6 + horizonBoost + toneAdjustment, 10, 98)
      : fallbackProbability;

    return [
      {
        label: 'Financial Health Score',
        value: financialHealthScore,
        helper: 'Heuristic based on return contribution versus invested capital.',
        barClass: 'bg-[#34d399]',
      },
      {
        label: 'Goal Probability Indicator',
        value: goalProbabilityIndicator,
        helper:
          'Heuristic from return-inflation gap and timeline; this is not a guarantee.',
        barClass: 'bg-[#93c5fd]',
      },
    ];
  }, [insights, results]);

  const metricCards = [
    {
      label: 'Required Monthly Investment',
      value: results.requiredMonthlySIP,
      className:
        'text-[clamp(1.55rem,3vw,2.5rem)] font-bold leading-tight tracking-tight break-all [overflow-wrap:anywhere]',
    },
    {
      label: 'Future Goal Value',
      value: results.inflatedGoalValue,
      className:
        'text-[clamp(1.55rem,3vw,2.5rem)] font-bold leading-tight tracking-tight break-all [overflow-wrap:anywhere]',
    },
    {
      label: 'Total Amount Invested',
      value: results.totalInvestedAmount,
      className: 'text-xl font-semibold leading-tight break-all [overflow-wrap:anywhere]',
    },
    {
      label: 'Estimated Returns',
      value: results.estimatedReturns,
      className:
        'block w-full max-w-full rounded bg-[#ffffff33] px-2 py-1 text-[clamp(1rem,1.8vw,1.2rem)] font-semibold leading-snug text-[#ffe1dd] whitespace-normal break-words [overflow-wrap:anywhere]',
    },
  ];

  return (
    <motion.section
      className="rounded-xl bg-primary_blue p-5 text-white shadow-md sm:p-6"
      aria-labelledby="results-heading"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
    >
      <h2 id="results-heading" className="mb-1 text-xl font-bold">
        Results for: {goalName}
      </h2>
      <p className="mb-6 text-sm text-[#dbe7ff]">Based on your inputs and assumptions</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {metricCards.map((metric, index) => (
          <motion.article
            key={metric.label}
            className="min-w-0 overflow-hidden rounded bg-[#ffffff1a] p-4 backdrop-blur-sm"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.3,
              delay: shouldReduceMotion ? 0 : index * 0.06,
            }}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    y: -2,
                    scale: 1.01,
                    boxShadow: '0 16px 28px rgba(15, 23, 42, 0.16)',
                  }
            }
          >
            <p className="mb-1 text-sm text-[#dbe7ff]">{metric.label}</p>
            <AnimatedCurrency value={metric.value} className={metric.className} />
          </motion.article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2" aria-label="Goal progress indicators">
        {progressIndicators.map((indicator, index) => {
          const safeValue = clamp(indicator.value, 0, 100);

          return (
            <motion.article
              key={indicator.label}
              className="rounded-lg border border-[#ffffff38] bg-[#ffffff14] p-4"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                delay: shouldReduceMotion ? 0 : 0.1 + index * 0.07,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{indicator.label}</p>
                <span className="text-sm font-semibold text-white">
                  {Math.round(safeValue)}%
                </span>
              </div>
              <p className="mt-1 text-xs text-[#dbe7ff]">{indicator.helper}</p>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#ffffff3b]">
                <motion.div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(safeValue)}
                  aria-label={`${indicator.label} ${Math.round(safeValue)} percent`}
                  className={`h-full rounded-full ${indicator.barClass}`}
                  initial={shouldReduceMotion ? { width: `${safeValue}%` } : { width: 0 }}
                  animate={{ width: `${safeValue}%` }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.7,
                    delay: shouldReduceMotion ? 0 : 0.2 + index * 0.08,
                    ease: 'easeOut',
                  }}
                />
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
};

export default ResultsCard;
