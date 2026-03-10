'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ChevronLeft, Download, Plus } from 'lucide-react';
import GoalInputForm from '@/components/GoalInputForm';
import ResultsCard from '@/components/ResultsCard';
import GoalTimeline from '@/components/GoalTimeline';
import AssumptionControls from '@/components/AssumptionControls';
import Disclaimer from '@/components/Disclaimer';
import GoalCard from '@/components/GoalCard';
import InvestmentTable from '@/components/InvestmentTable';
import CalculationMethodology from '@/components/CalculationMethodology';
import useCalculator from '@/hooks/useCalculator';
import { formatCurrency } from '@/utils/financialHelpers';

const GrowthChart = dynamic(() => import('@/components/GrowthChart'), { ssr: false });
const ScenarioComparison = dynamic(() => import('@/components/ScenarioComparison'), {
  ssr: false,
});

const PlannerWorkspace = ({ onBack }) => {
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const {
    goals,
    goalPlans,
    selectedGoal,
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
    if (!reportRef.current || !selectedGoal) return;

    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f3f6fb',
      });

      const image = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const printableWidth = pageWidth - margin * 2;
      const printableHeight = pageHeight - margin * 2;
      const imageHeight = (canvas.height * printableWidth) / canvas.width;

      let heightLeft = imageHeight;
      let position = margin;

      pdf.addImage(
        image,
        'PNG',
        margin,
        position,
        printableWidth,
        imageHeight,
        undefined,
        'FAST'
      );

      heightLeft -= printableHeight;

      while (heightLeft > 0) {
        position = heightLeft - imageHeight + margin;
        pdf.addPage();
        pdf.addImage(
          image,
          'PNG',
          margin,
          position,
          printableWidth,
          imageHeight,
          undefined,
          'FAST'
        );
        heightLeft -= printableHeight;
      }

      const safeGoalName = (selectedGoal.goalName || 'goal-plan')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      pdf.save(`${safeGoalName || 'goal-plan'}-financial-plan.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-md border border-primary_blue px-3 py-2 text-sm font-medium text-primary_blue transition-colors hover:bg-primary_blue hover:text-white"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Back To Overview
        </button>
      </div>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Portfolio summary"
      >
        <article className="min-w-0 rounded-lg border border-[#9190904d] bg-white p-4 shadow-sm">
          <p className="text-sm text-text_secondary">Total Goals</p>
          <p className="mt-1 text-2xl font-bold text-primary_blue">{goals.length}</p>
        </article>
        <article className="min-w-0 rounded-lg border border-[#9190904d] bg-white p-4 shadow-sm">
          <p className="text-sm text-text_secondary">Combined Monthly SIP</p>
          <p className="mt-1 text-2xl font-bold leading-tight text-primary_blue break-all [overflow-wrap:anywhere]">
            {formatCurrency(portfolioSummary.monthlySIP)}
          </p>
        </article>
        <article className="min-w-0 rounded-lg border border-[#9190904d] bg-white p-4 shadow-sm">
          <p className="text-sm text-text_secondary">Combined Goal Value</p>
          <p className="mt-1 text-2xl font-bold leading-tight text-primary_blue break-all [overflow-wrap:anywhere]">
            {formatCurrency(portfolioSummary.futureValue)}
          </p>
        </article>
        <article className="min-w-0 rounded-lg border border-[#9190904d] bg-white p-4 shadow-sm">
          <p className="text-sm text-text_secondary">Active Goal</p>
          <p className="mt-1 text-xl font-semibold text-text_primary break-words">
            {selectedGoal?.goalName?.trim() || 'Untitled Goal'}
          </p>
        </article>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <section className="rounded-lg border border-[#9190904d] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-primary_blue">Financial Goals</h2>
              <button
                type="button"
                onClick={handleAddGoal}
                className="inline-flex items-center gap-2 rounded-md bg-primary_blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#224c87e6]"
                aria-label="Add financial goal"
              >
                <Plus size={16} aria-hidden="true" />
                Add Goal
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {goalPlans.map((item) => (
                <GoalCard
                  key={item.goal.id}
                  goal={item.goal}
                  result={item.plan}
                  isActive={item.goal.id === selectedGoal?.id}
                  disableRemove={goals.length === 1}
                  onSelect={setSelectedGoalId}
                  onRemove={removeGoal}
                />
              ))}
            </div>
          </section>

          <GoalInputForm goal={selectedGoal} onFieldChange={onGoalFieldChange} />
          <AssumptionControls goal={selectedGoal} onFieldChange={onGoalFieldChange} />
        </div>

        <section className="space-y-6 lg:col-span-8" ref={reportRef}>
          <div className="flex flex-col gap-4 rounded-lg border border-[#9190904d] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-primary_blue break-words">
                {(selectedGoal?.goalName?.trim() || 'Untitled Goal')} Plan
              </h2>
              <p className="text-sm text-text_secondary">
                Projection view with growth chart, scenarios, and timeline.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadFinancialPlan}
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary_blue px-4 py-2 text-sm font-medium text-primary_blue transition-colors hover:bg-primary_blue hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Download financial plan PDF"
            >
              <Download size={16} aria-hidden="true" />
              {isExporting ? 'Generating PDF...' : 'Download Financial Plan'}
            </button>
          </div>

          {selectedGoalResult && (
            <>
              <ResultsCard
                results={selectedGoalResult}
                goalName={selectedGoal.goalName?.trim() || 'Untitled Goal'}
              />

              <CalculationMethodology goal={selectedGoal} results={selectedGoalResult} />

              <div className="rounded-lg border border-[#9190904d] bg-card_background p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-primary_blue">Investment Growth Projection</h2>
                <GrowthChart data={selectedGoalResult.growthData} />
              </div>

              <InvestmentTable rows={selectedGoalResult.yearlyBreakdown} />

              <ScenarioComparison scenarios={scenarioData} />

              <div className="rounded-lg border border-[#9190904d] bg-card_background p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-primary_blue">Goal Timeline Visualization</h2>
                <GoalTimeline
                  years={selectedGoal.yearsToGoal}
                  timelineData={selectedGoalResult.timelineData}
                  goalName={selectedGoal.goalName}
                />
              </div>

              <Disclaimer />
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default PlannerWorkspace;
