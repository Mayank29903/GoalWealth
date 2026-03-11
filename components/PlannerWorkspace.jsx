'use client';

import { useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ChevronLeft,
  CircleAlert,
  Download,
  Flag,
  HandCoins,
  Landmark,
  Plus,
} from 'lucide-react';
import GoalInputForm from '@/components/GoalInputForm';
import ResultsCard from '@/components/ResultsCard';
import GoalTimeline from '@/components/GoalTimeline';
import AssumptionControls from '@/components/AssumptionControls';
import Disclaimer from '@/components/Disclaimer';
import GoalCard from '@/components/GoalCard';
import KPICards from '@/components/KPICards';
import InvestmentTable from '@/components/InvestmentTable';
import CalculationMethodology from '@/components/CalculationMethodology';
import GoalInsightsPanel from '@/components/GoalInsightsPanel';
import FinancialHealthScore from '@/components/FinancialHealthScore';
import InflationImpactChart from '@/components/InflationImpactChart';
import HorizonSimulator from '@/components/HorizonSimulator';
import useCalculator from '@/hooks/useCalculator';
import { exportElementToPdf } from '@/utils/pdfExport';

const GrowthChart = dynamic(() => import('@/components/GrowthChart'), { ssr: false });
const ScenarioComparison = dynamic(() => import('@/components/ScenarioComparison'), {
  ssr: false,
});

const PlannerWorkspace = ({ onBack }) => {
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const {
    goals,
    goalPlans,
    selectedGoal,
    selectedGoalValidation,
    selectedGoalInsights,
    selectedGoalResult,
    scenarioData,
    portfolioSummary,
    addGoal,
    removeGoal,
    setSelectedGoalId,
    updateGoal,
  } = useCalculator();

  const onGoalFieldChange = (field, value) => {
    if (!selectedGoal) return;
    updateGoal(selectedGoal.id, field, value);
  };

  const reportDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date()),
    []
  );

  const missingFields = [
    !selectedGoalValidation.hasName && 'Goal name',
    !selectedGoalValidation.hasCurrentCost && 'Present cost of goal',
    !selectedGoalValidation.hasTimeline && 'Years to achieve goal',
  ].filter(Boolean);

  const handleAddGoal = () => {
    addGoal();

    window.setTimeout(() => {
      const goalDetailsSection = document.getElementById('goal-details-section');
      goalDetailsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const goalNameInput = document.getElementById('goalName');
      goalNameInput?.focus();
    }, 80);
  };

  const downloadFinancialPlan = async () => {
    if (!reportRef.current || !selectedGoal || !selectedGoalValidation.isComplete) return;

    setIsExporting(true);
    setExportError('');

    try {
      await new Promise((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(resolve);
        });
      });

      const safeGoalName = (selectedGoal.goalName || 'goal-plan')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      await exportElementToPdf({
        element: reportRef.current,
        filename: `${safeGoalName || 'goal-plan'}-financial-plan.pdf`,
        backgroundColor: '#f3f6fb',
        scale: 2,
        margin: 24,
      });
    } catch (error) {
      setExportError(
        'Unable to generate PDF right now. Please try again after checking goal details.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const statCards = [
    {
      title: 'Total Goals',
      value: goals.length,
      valueType: 'number',
      valueClass: 'text-primary_blue',
      icon: Flag,
    },
    {
      title: 'Combined Monthly SIP',
      value: portfolioSummary.monthlySIP,
      valueType: 'currency',
      valueClass: 'text-primary_blue',
      icon: HandCoins,
    },
    {
      title: 'Combined Goal Value',
      value: portfolioSummary.futureValue,
      valueType: 'currency',
      valueClass: 'text-primary_blue',
      icon: Landmark,
    },
    {
      title: 'Active Goal',
      value: selectedGoal?.goalName?.trim() || 'Untitled Goal',
      valueType: 'text',
      valueClass: 'text-text_primary',
      icon: CircleAlert,
    },
  ];

  return (
    <div className="space-y-8">
      <header className="ui-card ui-card-static relative overflow-hidden rounded-2xl p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-16 h-52 w-52 rounded-full bg-[#224c8717] blur-3xl" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text_secondary">
              Planner Workspace
            </p>
            <h2 className="mt-1 text-2xl font-bold text-primary_blue sm:text-3xl">
              Build, Compare, And Export Goal Plans
            </h2>
            <p className="mt-2 text-sm text-text_secondary">
              Enter required inputs, review calculations, then export a clean report.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary_blue px-4 py-2 text-sm font-semibold text-primary_blue transition-colors hover:bg-primary_blue hover:text-white"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Back To Overview
          </button>
        </div>
      </header>

      <KPICards cards={statCards} />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <aside className="space-y-6 lg:col-span-4" aria-label="Goal setup panel">
          <section className="ui-card rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-primary_blue">Financial Goals</h3>
              <button
                type="button"
                onClick={handleAddGoal}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary_blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#224c87e6]"
                aria-label="Add financial goal"
              >
                <Plus size={16} aria-hidden="true" />
                Add Goal
              </button>
            </div>

            <ul role="list" className="mt-4 space-y-3">
              {goalPlans.map((item) => (
                <li key={item.goal.id}>
                  <GoalCard
                    goal={item.goal}
                    result={item.plan}
                    isConfigured={item.isComplete}
                    isActive={item.goal.id === selectedGoal?.id}
                    disableRemove={goals.length === 1}
                    onSelect={setSelectedGoalId}
                    onRemove={removeGoal}
                  />
                </li>
              ))}
            </ul>
          </section>

          <GoalInputForm goal={selectedGoal} onFieldChange={onGoalFieldChange} />
          <AssumptionControls goal={selectedGoal} onFieldChange={onGoalFieldChange} />

          <section aria-label="Financial health panel">
            {selectedGoalValidation.isComplete && selectedGoalResult ? (
              <FinancialHealthScore
                requiredMonthlySIP={selectedGoalResult.requiredMonthlySIP}
                estimatedMonthlyIncome={selectedGoal.monthlyIncome}
                yearsToGoal={selectedGoal.yearsToGoal}
                inflationRate={selectedGoal.inflationRate}
                expectedReturn={selectedGoal.expectedReturn}
                totalInvestedAmount={selectedGoalResult.totalInvestedAmount}
                inflatedGoalValue={selectedGoalResult.inflatedGoalValue}
                healthAssumptions={{
                  sipThresholdPct: selectedGoal.healthSipThresholdPct,
                  shortHorizonYears: selectedGoal.healthShortHorizonYears,
                  safetyGapPct: selectedGoal.healthSafetyGapPct,
                }}
              />
            ) : (
              <div className="ui-card rounded-xl p-4">
                <h4 className="text-sm font-semibold text-primary_blue">Financial Health Score</h4>
                <p className="mt-1 text-xs text-text_secondary">
                  Complete required goal details to see the score and health signals here.
                </p>
              </div>
            )}
          </section>

          <section aria-label="Inflation impact panel">
            {selectedGoalValidation.isComplete && selectedGoalResult ? (
              <InflationImpactChart
                presentCost={selectedGoal.currentCost}
                inflatedCost={selectedGoalResult.inflatedGoalValue}
                inflationRate={selectedGoal.inflationRate}
                yearsToGoal={selectedGoal.yearsToGoal}
              />
            ) : (
              <div className="ui-card rounded-xl p-4">
                <h4 className="text-sm font-semibold text-primary_blue">Inflation Impact Visualization</h4>
                <p className="mt-1 text-xs text-text_secondary">
                  Complete required goal details to compare present vs inflation-adjusted goal cost.
                </p>
              </div>
            )}
          </section>

          <section aria-label="Investment horizon simulator panel">
            {selectedGoalValidation.isComplete && selectedGoalResult ? (
              <HorizonSimulator
                key={`horizon-simulator-${selectedGoal?.id || 'default'}`}
                currentCost={selectedGoal.currentCost}
                inflationRate={selectedGoal.inflationRate}
                expectedReturn={selectedGoal.expectedReturn}
                baselineYears={selectedGoal.yearsToGoal}
                baselineSIP={selectedGoalResult.requiredMonthlySIP}
              />
            ) : (
              <div className="ui-card rounded-xl p-4">
                <h4 className="text-sm font-semibold text-primary_blue">Investment Horizon Simulator</h4>
                <p className="mt-1 text-xs text-text_secondary">
                  Complete required goal details to simulate 1 to 30 year SIP outcomes.
                </p>
              </div>
            )}
          </section>
        </aside>

        <section className="space-y-6 lg:col-span-8" aria-label="Goal analysis and report">
          <div className="ui-card flex flex-col gap-4 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-primary_blue wrap-break-word">
                {(selectedGoal?.goalName?.trim() || 'Untitled Goal')} Plan
              </h3>
              <p className="text-sm text-text_secondary">
                Projection view with growth chart, scenarios, and timeline.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadFinancialPlan}
              disabled={isExporting || !selectedGoalValidation.isComplete}
              data-export-ignore="true"
              data-html2canvas-ignore="true"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary_blue px-4 py-2 text-sm font-semibold text-primary_blue transition-colors hover:bg-primary_blue hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Download financial plan PDF"
            >
              <Download size={16} aria-hidden="true" />
              {isExporting
                ? 'Generating PDF...'
                : selectedGoalValidation.isComplete
                  ? 'Download Financial Plan'
                  : 'Complete Goal Details To Download'}
            </button>
          </div>

          {exportError ? (
            <p role="alert" className="rounded-lg border border-[#b4231840] bg-[#fff1f2] p-3 text-sm text-[#7a271a]">
              {exportError}
            </p>
          ) : null}

          <div ref={reportRef} className="space-y-6" aria-live="polite">
            <section
              data-pdf-section="true"
              className="ui-card ui-card-static rounded-xl bg-linear-to-r from-white to-[#f8fbff] p-5 sm:p-6"
            >
              <h4 className="text-base font-bold text-primary_blue">Report Snapshot</h4>
              <p className="mt-1 text-sm text-text_secondary">
                Generated on {reportDate}. Assumptions and projections are displayed below.
              </p>
            </section>

            {!selectedGoalValidation.isComplete ? (
              <section
                data-pdf-section="true"
                className="rounded-xl border border-[#b4231840] bg-[#fff5f5] p-5 shadow-sm sm:p-6"
                role="status"
                aria-label="Goal details completion prompt"
              >
                <h4 className="text-lg font-bold text-primary_blue">Complete Goal Details To Continue</h4>
                <p className="mt-1 text-sm text-text_secondary">
                  Calculations will appear after you provide all mandatory fields for this goal.
                </p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-text_secondary">
                  {missingFields.map((field) => (
                    <li key={field}>{field} is required</li>
                  ))}
                </ul>
              </section>
            ) : (
              selectedGoalResult && (
                <div className="space-y-6">
                  <div data-pdf-section="true">
                    <ResultsCard
                      results={selectedGoalResult}
                      goalName={selectedGoal.goalName?.trim() || 'Untitled Goal'}
                      insights={selectedGoalInsights}
                    />
                  </div>

                  <div data-pdf-section="true">
                    <GoalInsightsPanel insights={selectedGoalInsights} />
                  </div>

                  <div data-pdf-section="true">
                    <CalculationMethodology goal={selectedGoal} results={selectedGoalResult} />
                  </div>

                  <div data-pdf-section="true" className="ui-card rounded-xl p-5 sm:p-6">
                    <h4 className="mb-4 text-xl font-bold text-primary_blue">Investment Growth Projection</h4>
                    <GrowthChart data={selectedGoalResult.growthData} />
                  </div>

                  <div data-pdf-section="true">
                    <InvestmentTable rows={selectedGoalResult.yearlyBreakdown} />
                  </div>

                  <div data-pdf-section="true">
                    <ScenarioComparison scenarios={scenarioData} />
                  </div>

                  <div data-pdf-section="true" className="ui-card rounded-xl p-5 sm:p-6">
                    <h4 className="mb-4 text-xl font-bold text-primary_blue">Goal Timeline Visualization</h4>
                    <GoalTimeline
                      years={selectedGoal.yearsToGoal}
                      timelineData={selectedGoalResult.timelineData}
                      goalName={selectedGoal.goalName?.trim() || 'Untitled Goal'}
                    />
                  </div>
                </div>
              )
            )}

            <div data-pdf-section="true">
              <Disclaimer />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlannerWorkspace;
