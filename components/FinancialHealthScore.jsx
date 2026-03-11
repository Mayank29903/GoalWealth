'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { formatCurrency } from '@/utils/financialHelpers';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toSafeNumber = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const formatPercent = (value) =>
  `${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)}%`;

const getScoreCategory = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Moderate';
  return 'Risky';
};

const toneConfig = {
  Excellent: {
    ring: '#15803d',
    badge: 'bg-[#15803d1a] text-[#14532d] border-[#15803d40]',
  },
  Good: {
    ring: '#224c87',
    badge: 'bg-[#224c8714] text-primary_blue border-[#224c8740]',
  },
  Moderate: {
    ring: '#b45309',
    badge: 'bg-[#b4530914] text-[#7c2d12] border-[#b4530940]',
  },
  Risky: {
    ring: '#b42318',
    badge: 'bg-[#b4231814] text-[#7a271a] border-[#b4231840]',
  },
};

const buildPillarScore = ({ value, goodThreshold, poorThreshold }) => {
  if (value <= goodThreshold) return 100;
  if (value >= poorThreshold) return 0;

  const ratio = (value - goodThreshold) / (poorThreshold - goodThreshold);
  return Math.round((1 - ratio) * 100);
};

const pillarShortLabel = {
  affordability: 'Affordability',
  timeline: 'Timeline',
  cushion: 'Cushion',
  efficiency: 'Efficiency',
};

const FinancialHealthScore = ({
  requiredMonthlySIP,
  estimatedMonthlyIncome,
  yearsToGoal,
  inflationRate,
  expectedReturn,
  totalInvestedAmount,
  inflatedGoalValue,
  healthAssumptions,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const scoreData = useMemo(() => {
    const sip = toSafeNumber(requiredMonthlySIP);
    const income = toSafeNumber(estimatedMonthlyIncome);
    const years = toSafeNumber(yearsToGoal);
    const inflation = toSafeNumber(inflationRate);
    const returns = toSafeNumber(expectedReturn);
    const totalInvested = toSafeNumber(totalInvestedAmount);
    const futureValue = toSafeNumber(inflatedGoalValue);

    const sipThreshold = clamp(toSafeNumber(healthAssumptions?.sipThresholdPct), 20, 80) || 40;
    const shortHorizonThreshold =
      clamp(toSafeNumber(healthAssumptions?.shortHorizonYears), 2, 15) || 5;
    const safetyGap = clamp(toSafeNumber(healthAssumptions?.safetyGapPct), 0, 8) || 2;

    const sipLoadPct = income > 0 ? (sip / income) * 100 : null;
    const realReturnCushion = returns - inflation;
    const contributionSharePct = futureValue > 0 ? (totalInvested / futureValue) * 100 : 100;

    const affordabilityScore =
      sipLoadPct === null
        ? 55
        : buildPillarScore({
            value: sipLoadPct,
            goodThreshold: sipThreshold * 0.6,
            poorThreshold: sipThreshold * 1.65,
          });
    const timelineScore = buildPillarScore({
      value: shortHorizonThreshold * 1.9 - years,
      goodThreshold: 0,
      poorThreshold: shortHorizonThreshold * 1.6,
    });
    const cushionGapShortfall = Math.max(0, safetyGap - realReturnCushion);
    const returnCushionScore = buildPillarScore({
      value: cushionGapShortfall,
      goodThreshold: 0,
      poorThreshold: Math.max(2, safetyGap + 4),
    });
    const fundingEfficiencyScore = buildPillarScore({
      value: contributionSharePct,
      goodThreshold: 55,
      poorThreshold: 92,
    });

    const pillars = [
      { id: 'affordability', score: affordabilityScore, weight: 0.35 },
      { id: 'timeline', score: timelineScore, weight: 0.25 },
      { id: 'cushion', score: returnCushionScore, weight: 0.25 },
      { id: 'efficiency', score: fundingEfficiencyScore, weight: 0.15 },
    ];

    const weightedComposite = pillars.reduce(
      (acc, pillar) => acc + pillar.score * pillar.weight,
      0
    );

    let rulePenalty = 0;
    const deductions = [];

    if (sipLoadPct !== null && sipLoadPct > sipThreshold) {
      rulePenalty += 20;
      deductions.push(`SIP load > ${formatPercent(sipThreshold)} of income.`);
    }
    if (years > 0 && years < shortHorizonThreshold) {
      rulePenalty += 15;
      deductions.push(`Timeline < ${shortHorizonThreshold} years.`);
    }
    if (inflation > returns - safetyGap) {
      rulePenalty += 10;
      deductions.push(`Return cushion below ${formatPercent(safetyGap)}.`);
    }

    const additionalPenalty = Math.round(
      clamp(
        ((100 - weightedComposite) * 0.25) +
          (sipLoadPct === null ? 4 : 0) +
          (contributionSharePct > 85 ? 4 : 0),
        0,
        24
      )
    );

    const score = clamp(Math.round(100 - rulePenalty - additionalPenalty), 0, 100);
    const category = getScoreCategory(score);

    return {
      score,
      category,
      deductions,
      pillars,
      sipLoadPct,
      realReturnCushion,
      assumptionsText: `SIP<=${formatPercent(sipThreshold)} | Horizon>=${shortHorizonThreshold}y | Cushion>=${formatPercent(safetyGap)}`,
    };
  }, [
    estimatedMonthlyIncome,
    expectedReturn,
    healthAssumptions?.safetyGapPct,
    healthAssumptions?.shortHorizonYears,
    healthAssumptions?.sipThresholdPct,
    inflatedGoalValue,
    inflationRate,
    requiredMonthlySIP,
    totalInvestedAmount,
    yearsToGoal,
  ]);

  const tone = toneConfig[scoreData.category];
  const progressDegrees = (scoreData.score / 100) * 360;
  const topDeductions = scoreData.deductions.slice(0, 2);

  return (
    <motion.section
      className="ui-card ui-card-static flex min-h-[600px] flex-col rounded-xl p-4"
      aria-labelledby="financial-health-score-heading"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 id="financial-health-score-heading" className="text-base font-bold text-primary_blue">
            Financial Health Score
          </h3>
          <p className="mt-0.5 text-xs text-text_secondary">{scoreData.assumptionsText}</p>
        </div>
        <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold ${tone.badge}`}>
          {scoreData.category}
        </span>
      </div>

      <div className="mt-4 flex justify-center">
        <div
          role="progressbar"
          aria-label="Financial health score"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(scoreData.score)}
          className="relative h-[132px] w-[132px] rounded-full p-2"
          style={{
            background: `conic-gradient(${tone.ring} ${progressDegrees}deg, #e2e8f0 ${progressDegrees}deg)`,
          }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
            <p className="text-4xl font-black text-text_primary">{Math.round(scoreData.score)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="ui-subcard rounded-md px-2 py-1.5">
          <p className="text-text_secondary">SIP</p>
          <p className="font-semibold text-primary_blue">
            {formatCurrency(toSafeNumber(requiredMonthlySIP))}
          </p>
        </div>
        <div className="ui-subcard rounded-md px-2 py-1.5">
          <p className="text-text_secondary">SIP Load</p>
          <p className="font-semibold text-primary_blue">
            {scoreData.sipLoadPct === null ? 'Add income' : formatPercent(scoreData.sipLoadPct)}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {scoreData.pillars.map((pillar) => (
          <article key={pillar.id} className="rounded-md border border-[#dbe7f7] bg-[#f8fbff] px-2.5 py-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-text_secondary">{pillarShortLabel[pillar.id]}</span>
              <span className="font-semibold text-text_primary">{pillar.score}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#dbe7f7]">
              <div
                className="h-full rounded-full bg-primary_blue transition-[width] duration-500"
                style={{ width: `${pillar.score}%` }}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-3">
        {topDeductions.length ? (
          <ul className="space-y-1 text-xs text-text_secondary">
            {topDeductions.map((item) => (
              <li key={item} className="rounded-md border border-[#91909033] bg-[#f8fbff] px-2.5 py-1.5">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border border-[#15803d33] bg-[#f0fdf4] px-2.5 py-1.5 text-xs text-[#14532d]">
            No active risk flags from your current assumptions.
          </p>
        )}
      </div>

      <p className="mt-auto pt-2 text-[11px] text-text_secondary">
        Real return cushion: {formatPercent(scoreData.realReturnCushion)}
      </p>
    </motion.section>
  );
};

export default FinancialHealthScore;
