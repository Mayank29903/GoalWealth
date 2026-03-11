'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '@/utils/financialHelpers';

const highlights = [
  {
    id: 'goal-first',
    title: 'Goal-First Strategy',
    description: 'Start with a real goal, then the calculator estimates your SIP.',
    icon: Target,
    intro:
      'Pick a life goal first. The calculator inflates today\'s cost and tells you how much to invest every month.',
    beginnerExamples: [
      {
        label: 'Education Starter',
        goalName: 'Child Education',
        currentCost: 1000000,
        years: 10,
        inflationRate: 6,
        returnRate: 12,
      },
      {
        label: 'Home Renovation',
        goalName: 'Home Renovation',
        currentCost: 500000,
        years: 4,
        inflationRate: 5,
        returnRate: 10,
      },
    ],
  },
  {
    id: 'scenario-intelligence',
    title: 'Scenario Intelligence',
    description: 'Try different return assumptions and compare SIP impact.',
    icon: TrendingUp,
    intro:
      'A small return change can change SIP a lot. Use this to plan with safer expectations.',
    beginnerExamples: [
      {
        label: 'House Fund',
        goalName: 'House Down Payment',
        currentCost: 2500000,
        years: 10,
        inflationRate: 5.5,
        returnRate: 12,
        comparisonReturn: 9,
      },
      {
        label: 'Car Upgrade',
        goalName: 'Car Purchase',
        currentCost: 800000,
        years: 5,
        inflationRate: 5,
        returnRate: 10,
        comparisonReturn: 8,
      },
    ],
  },
  {
    id: 'actionable-output',
    title: 'Actionable Output',
    description: 'Get clear numbers and a downloadable plan you can execute.',
    icon: ShieldCheck,
    intro:
      'You get a simple action summary: monthly SIP, future goal value, and expected returns.',
    beginnerExamples: [
      {
        label: 'Emergency Corpus',
        goalName: 'Emergency Fund',
        currentCost: 600000,
        years: 3,
        inflationRate: 5,
        returnRate: 9,
      },
      {
        label: 'Wedding Budget',
        goalName: 'Wedding Goal',
        currentCost: 1200000,
        years: 7,
        inflationRate: 6,
        returnRate: 11,
      },
    ],
  },
];

const launchChecklist = [
  'Define your target goal and timeline',
  'Stress-test with inflation and return assumptions',
  'Generate a shareable and downloadable plan',
];

const impactStats = [
  { label: 'Planning Steps', value: '3' },
  { label: 'Projection Views', value: '4' },
  { label: 'Export Ready', value: 'PDF' },
];

const calculateSampleProjection = ({ currentCost, years, inflationRate, returnRate }) => {
  const inflatedGoalValue = currentCost * Math.pow(1 + inflationRate / 100, years);
  const months = years * 12;
  const monthlyRate = returnRate / 1200;

  const requiredMonthlySIP =
    monthlyRate <= 0
      ? inflatedGoalValue / months
      : (inflatedGoalValue * monthlyRate) /
        ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate));

  const totalInvestedAmount = requiredMonthlySIP * months;
  const estimatedReturns = inflatedGoalValue - totalInvestedAmount;

  return {
    inflatedGoalValue,
    requiredMonthlySIP,
    totalInvestedAmount,
    estimatedReturns,
  };
};

const formatRate = (value) =>
  `${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)}%`;

const LandingPage = ({ onStart }) => {
  const [activeHighlightId, setActiveHighlightId] = useState(null);

  const activeHighlight = useMemo(
    () => highlights.find((item) => item.id === activeHighlightId) ?? null,
    [activeHighlightId]
  );

  const activeExamples = useMemo(() => {
    if (!activeHighlight) return [];

    return activeHighlight.beginnerExamples.map((example) => {
      const primary = calculateSampleProjection(example);
      const comparison = example.comparisonReturn
        ? calculateSampleProjection({
            ...example,
            returnRate: example.comparisonReturn,
          })
        : null;

      return {
        ...example,
        primary,
        comparison,
      };
    });
  }, [activeHighlight]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#224c8740] bg-linear-to-br from-white via-[#eef4fa] to-[#fcefed] p-8 shadow-xl lg:p-12">
        <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[#224c8733] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#b4231826] blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#224c8740] bg-[#224c8712] px-4 py-1 text-sm font-semibold text-primary_blue">
              <Sparkles size={15} aria-hidden="true" />
              Built For Goal-Based Investing
            </span>

            <h2 className="mt-5 text-4xl font-black leading-tight text-text_primary md:text-5xl">
              Build A Winning Goal Plan In Minutes
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text_secondary">
              Start with your life goals, tune assumptions, and get a data-backed SIP strategy you
              can act on with confidence.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary_blue px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#1b3c6c]"
              >
                Start Planning
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <a
                href="#launch-flow"
                className="inline-flex items-center justify-center rounded-xl border border-primary_blue px-6 py-3 text-sm font-semibold text-primary_blue transition-colors hover:bg-[#224c870f]"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {impactStats.map((stat) => (
                <div
                  key={stat.label}
                  className="ui-subcard rounded-xl px-3 py-2"
                >
                  <p className="text-lg font-bold text-primary_blue">{stat.value}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-text_secondary">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <article className="ui-card rounded-2xl bg-[#ffffffe6] p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text_secondary">
              Launch Flow
            </p>
            <h3 className="mt-2 text-2xl font-bold text-primary_blue">From Idea To Plan</h3>

            <ol id="launch-flow" className="mt-5 space-y-4">
              {launchChecklist.map((item, index) => (
                <li
                  key={item}
                  className="ui-subcard flex items-start gap-3 rounded-xl p-3"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary_blue text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-text_primary">{item}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#b4231840] bg-[#b4231814] p-3 text-sm font-medium text-text_primary">
              <CalendarClock size={16} className="text-accent_red" aria-hidden="true" />
              Typical setup time: under 3 minutes
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Key capabilities">
        {highlights.map((highlight) => {
          const Icon = highlight.icon;
          const isActive = activeHighlightId === highlight.id;

          return (
            <button
              key={highlight.id}
              type="button"
              onClick={() =>
                setActiveHighlightId((prev) => (prev === highlight.id ? null : highlight.id))
              }
              aria-pressed={isActive}
              className={`ui-card rounded-2xl p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary_blue ${
                isActive ? 'border-primary_blue ring-1 ring-[#224c8759]' : 'border-[#9190904d]'
              }`}
            >
              <span className="inline-flex rounded-xl bg-[#224c8717] p-2 text-primary_blue">
                <Icon size={18} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-primary_blue">{highlight.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text_secondary">
                {highlight.description}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-text_secondary">
                {isActive ? 'Click again to hide examples' : 'Click to view simple examples'}
              </p>
            </button>
          );
        })}
      </section>

      {activeHighlight ? (
        <section
          className="ui-card rounded-2xl p-6 sm:p-7"
          aria-live="polite"
        >
          <h3 className="text-xl font-bold text-primary_blue">
            Simple Examples: {activeHighlight.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text_secondary">{activeHighlight.intro}</p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {activeExamples.map((example) => (
              <article
                key={example.label}
                className="ui-subcard rounded-xl p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-text_secondary">
                  {example.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary_blue">{example.goalName}</p>
                <ul className="mt-3 space-y-1 text-sm text-text_primary">
                  <li>
                    <strong>Today Cost:</strong> {formatCurrency(example.currentCost)}
                  </li>
                  <li>
                    <strong>Timeline:</strong> {example.years} years
                  </li>
                  <li>
                    <strong>Assumptions:</strong> Inflation {formatRate(example.inflationRate)},
                    Return {formatRate(example.returnRate)}
                  </li>
                  <li>
                    <strong>Future Goal Value:</strong>{' '}
                    {formatCurrency(example.primary.inflatedGoalValue)}
                  </li>
                  <li>
                    <strong>Monthly SIP Needed:</strong>{' '}
                    {formatCurrency(example.primary.requiredMonthlySIP)}
                  </li>
                </ul>

                {example.comparison ? (
                  <p className="mt-3 rounded-md border border-[#b4231840] bg-[#b423180d] p-2 text-xs text-text_secondary">
                    If return is {formatRate(example.comparisonReturn)} instead of{' '}
                    {formatRate(example.returnRate)}, SIP changes to{' '}
                    <strong>{formatCurrency(example.comparison.requiredMonthlySIP)}</strong>.
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary_blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1b3c6c]"
            >
              <CheckCircle2 size={16} aria-hidden="true" />
              Try These In Planner
            </button>
            <p className="text-xs text-text_secondary">
              Click the same card again to hide examples.
            </p>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[#91909080] bg-white p-6 text-center shadow-sm sm:p-7">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-2">
            <span className="inline-flex rounded-full bg-[#224c8714] p-2 text-primary_blue">
              <MousePointerClick size={18} aria-hidden="true" />
            </span>
            <h3 className="text-lg font-bold text-primary_blue">No Example Open Yet</h3>
            <p className="text-sm text-text_secondary">
              Click any section card above to view simple beginner examples. Click again to hide.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
