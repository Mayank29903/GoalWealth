'use client';

import {
  ArrowRight,
  CalendarClock,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

const highlights = [
  {
    title: 'Goal-First Strategy',
    description: 'Build SIP plans around real-life milestones, not random return chasing.',
    icon: Target,
  },
  {
    title: 'Scenario Intelligence',
    description: 'Compare inflation and return assumptions before you commit your money.',
    icon: TrendingUp,
  },
  {
    title: 'Actionable Output',
    description: 'Get a clean downloadable plan you can review and execute with clarity.',
    icon: ShieldCheck,
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

const LandingPage = ({ onStart }) => {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#224c8740] bg-gradient-to-br from-white via-[#eef4fa] to-[#fcefed] p-8 shadow-xl lg:p-12">
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
                  className="rounded-xl border border-[#224c8733] bg-[#ffffffcf] px-3 py-2"
                >
                  <p className="text-lg font-bold text-primary_blue">{stat.value}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-text_secondary">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <article className="rounded-2xl border border-[#224c8733] bg-[#ffffffe6] p-6 shadow-lg backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text_secondary">
              Launch Flow
            </p>
            <h3 className="mt-2 text-2xl font-bold text-primary_blue">From Idea To Plan</h3>

            <ol id="launch-flow" className="mt-5 space-y-4">
              {launchChecklist.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-[#91909033] bg-[#ffffffb3] p-3"
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

          return (
            <article
              key={highlight.title}
              className="rounded-2xl border border-[#9190904d] bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="inline-flex rounded-xl bg-[#224c8717] p-2 text-primary_blue">
                <Icon size={18} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-primary_blue">{highlight.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text_secondary">
                {highlight.description}
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default LandingPage;

