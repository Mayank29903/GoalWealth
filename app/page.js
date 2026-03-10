'use client';

import { useState, useMemo } from 'react';
import GoalInputForm from '@/components/GoalInputForm';
import ResultsCard from '@/components/ResultsCard';
import GrowthChart from '@/components/GrowthChart';
import GoalTimeline from '@/components/GoalTimeline';
import AssumptionControls from '@/components/AssumptionControls';
import Disclaimer from '@/components/Disclaimer';
import { calculateGoalPlan } from '@/utils/goalCalculator';
import { sanitizeNumber } from '@/utils/financialHelpers';

export default function Home() {
  const [goalName, setGoalName] = useState('Child Education');
  const [currentCost, setCurrentCost] = useState(1000000);
  const [yearsToGoal, setYearsToGoal] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [expectedReturn, setExpectedReturn] = useState(12);

  const results = useMemo(() => {
    return calculateGoalPlan({
      currentCost: sanitizeNumber(currentCost),
      years: sanitizeNumber(yearsToGoal),
      inflationRate: sanitizeNumber(inflationRate),
      expectedReturn: sanitizeNumber(expectedReturn),
    });
  }, [currentCost, yearsToGoal, inflationRate, expectedReturn]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <GoalInputForm
          goalName={goalName}
          setGoalName={setGoalName}
          currentCost={currentCost}
          setCurrentCost={setCurrentCost}
          yearsToGoal={yearsToGoal}
          setYearsToGoal={setYearsToGoal}
        />
        
        <AssumptionControls
          inflationRate={inflationRate}
          expectedReturn={expectedReturn}
          onInflationChange={setInflationRate}
          onReturnChange={setExpectedReturn}
        />
      </div>

      <div className="lg:col-span-8 space-y-6">
        <ResultsCard results={results} goalName={goalName} />
        
        <div className="bg-card_background p-6 rounded-lg shadow-sm border border-neutral_grey/30">
          <h2 className="text-xl font-bold text-primary_blue mb-4">Investment Growth Projection</h2>
          <GrowthChart data={results.growthData} />
        </div>

        <div className="bg-card_background p-6 rounded-lg shadow-sm border border-neutral_grey/30">
          <h2 className="text-xl font-bold text-primary_blue mb-4">Goal Timeline</h2>
          <GoalTimeline 
            years={yearsToGoal} 
            inflatedValue={results.inflatedGoalValue} 
            currentValue={currentCost}
          />
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}