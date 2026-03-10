'use client';

import { useMemo, useState } from 'react';
import { calculateGoalPlan } from '@/utils/goalCalculator';
import { sanitizeNumber } from '@/utils/financialHelpers';

const DEFAULT_SCENARIOS = [10, 12, 15];
const MAX_GOAL_COST = 1e13;
const MAX_YEARS = 50;
const MAX_RATE = 30;
const MAX_INFLATION_RATE = 20;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const clampToSafeNumber = (value, min, max) => {
  const safeValue = sanitizeNumber(value);
  return clamp(safeValue, min, max);
};

const buildGoalInsights = ({ goal, plan }) => {
  if (!goal || !plan) return null;

  const currentCost = sanitizeNumber(goal.currentCost);
  const yearsToGoal = clampToSafeNumber(goal.yearsToGoal, 1, MAX_YEARS);
  const inflationRate = clampToSafeNumber(goal.inflationRate, 0, MAX_INFLATION_RATE);
  const expectedReturn = clampToSafeNumber(goal.expectedReturn, 0, MAX_RATE);

  const realReturn =
    (((1 + expectedReturn / 100) / (1 + inflationRate / 100)) - 1) * 100;
  const annualSIP = plan.requiredMonthlySIP * 12;
  const goalGrowthMultiple =
    currentCost > 0 ? plan.inflatedGoalValue / currentCost : 0;
  const contributionShare =
    plan.inflatedGoalValue > 0
      ? (plan.totalInvestedAmount / plan.inflatedGoalValue) * 100
      : 0;

  const horizonBand =
    yearsToGoal <= 5 ? 'Short Horizon' : yearsToGoal <= 12 ? 'Medium Horizon' : 'Long Horizon';

  let guidanceTone = 'Balanced';
  let guidanceMessage =
    'Assumptions are reasonably balanced for long-term goal planning.';

  if (realReturn <= 0) {
    guidanceTone = 'Challenging';
    guidanceMessage =
      'Expected return is not beating inflation. SIP may remain high unless timeline or assumptions change.';
  } else if (realReturn > 0 && realReturn < 2) {
    guidanceTone = 'Conservative';
    guidanceMessage =
      'Real return margin is modest. Consider reviewing timeline flexibility and contribution capacity.';
  } else if (yearsToGoal <= 4) {
    guidanceTone = 'Tight Timeline';
    guidanceMessage =
      'Goal horizon is short, so required SIP may be aggressive even with good returns.';
  }

  return {
    realReturn,
    annualSIP,
    goalGrowthMultiple,
    contributionShare,
    horizonBand,
    guidanceTone,
    guidanceMessage,
  };
};

const validateGoalInputs = (goal) => {
  const goalName = goal?.goalName?.trim() || '';
  const currentCost = sanitizeNumber(goal?.currentCost);
  const yearsToGoal = sanitizeNumber(goal?.yearsToGoal);

  const hasName = goalName.length > 0;
  const hasCurrentCost = currentCost > 0;
  const hasTimeline = yearsToGoal >= 1;

  return {
    hasName,
    hasCurrentCost,
    hasTimeline,
    isComplete: hasName && hasCurrentCost && hasTimeline,
  };
};

const createGoal = ({ prefill = false, index = 1 } = {}) => ({
  id: `goal-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  goalName: prefill ? (index === 1 ? 'Child Education' : `Goal ${index}`) : '',
  currentCost: prefill ? 1000000 : '',
  yearsToGoal: prefill ? 10 : '',
  inflationRate: 6,
  expectedReturn: 12,
});

const sanitizeGoalInputs = (goal) => ({
  currentCost: clampToSafeNumber(goal.currentCost, 0, MAX_GOAL_COST),
  years: clampToSafeNumber(goal.yearsToGoal, 1, MAX_YEARS),
  inflationRate: clampToSafeNumber(goal.inflationRate, 0, MAX_INFLATION_RATE),
  expectedReturn: clampToSafeNumber(goal.expectedReturn, 0, MAX_RATE),
});

const useCalculator = () => {
  const [goals, setGoals] = useState(() => [createGoal({ prefill: false, index: 1 })]);
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0].id);

  const goalPlans = useMemo(
    () =>
      goals.map((goal) => {
        const validation = validateGoalInputs(goal);

        return {
          goal,
          ...validation,
          plan: validation.isComplete ? calculateGoalPlan(sanitizeGoalInputs(goal)) : null,
        };
      }),
    [goals]
  );

  const selectedGoal = useMemo(
    () => goals.find((goal) => goal.id === selectedGoalId) ?? goals[0],
    [goals, selectedGoalId]
  );

  const selectedGoalResult = useMemo(
    () => goalPlans.find((item) => item.goal.id === selectedGoal?.id)?.plan,
    [goalPlans, selectedGoal]
  );

  const selectedGoalValidation = useMemo(
    () => validateGoalInputs(selectedGoal),
    [selectedGoal]
  );

  const selectedGoalInsights = useMemo(
    () =>
      selectedGoalValidation.isComplete && selectedGoalResult
        ? buildGoalInsights({ goal: selectedGoal, plan: selectedGoalResult })
        : null,
    [selectedGoal, selectedGoalResult, selectedGoalValidation.isComplete]
  );

  const portfolioSummary = useMemo(
    () =>
      goalPlans.reduce(
        (acc, current) => ({
          monthlySIP: acc.monthlySIP + (current.plan?.requiredMonthlySIP || 0),
          futureValue: acc.futureValue + (current.plan?.inflatedGoalValue || 0),
        }),
        { monthlySIP: 0, futureValue: 0 }
      ),
    [goalPlans]
  );

  const scenarioReturns = useMemo(() => {
    const selectedReturn = Math.round(sanitizeNumber(selectedGoal?.expectedReturn || 0));
    const values = new Set([...DEFAULT_SCENARIOS, selectedReturn]);
    return [...values].filter((item) => item > 0).sort((a, b) => a - b);
  }, [selectedGoal?.expectedReturn]);

  const scenarioData = useMemo(() => {
    if (!selectedGoal || !selectedGoalResult) return [];

    return scenarioReturns.map((returnRate) => {
      const plan = calculateGoalPlan(
        sanitizeGoalInputs({
          ...selectedGoal,
          expectedReturn: returnRate,
        })
      );

      return {
        returnRate,
        requiredMonthlySIP: plan.requiredMonthlySIP,
        totalInvestedAmount: plan.totalInvestedAmount,
        estimatedReturns: plan.estimatedReturns,
        inflatedGoalValue: plan.inflatedGoalValue,
      };
    });
  }, [scenarioReturns, selectedGoal, selectedGoalResult]);

  const addGoal = () => {
    const newGoal = createGoal({ prefill: false, index: goals.length + 1 });
    setGoals((prev) => [...prev, newGoal]);
    setSelectedGoalId(newGoal.id);
  };

  const removeGoal = (goalId) => {
    if (goals.length <= 1) return;

    const updatedGoals = goals.filter((goal) => goal.id !== goalId);
    setGoals(updatedGoals);

    if (selectedGoalId === goalId) {
      setSelectedGoalId(updatedGoals[0].id);
    }
  };

  const updateGoal = (goalId, field, rawValue) => {
    const isEmptyNumericInput =
      rawValue === '' && (field === 'currentCost' || field === 'yearsToGoal');
    const value = field === 'goalName' ? rawValue : sanitizeNumber(rawValue);

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              [field]:
                isEmptyNumericInput
                  ? ''
                  : field === 'yearsToGoal'
                  ? clamp(value, 1, MAX_YEARS)
                  : field === 'inflationRate'
                    ? clamp(value, 0, MAX_INFLATION_RATE)
                    : field === 'expectedReturn'
                      ? clamp(value, 0, MAX_RATE)
                      : field === 'currentCost'
                        ? clamp(value, 0, MAX_GOAL_COST)
                        : value,
            }
          : goal
      )
    );
  };

  return {
    goals,
    goalPlans,
    selectedGoal,
    selectedGoalValidation,
    selectedGoalInsights,
    selectedGoalResult,
    portfolioSummary,
    scenarioData,
    addGoal,
    removeGoal,
    setSelectedGoalId,
    updateGoal,
  };
};

export default useCalculator;
