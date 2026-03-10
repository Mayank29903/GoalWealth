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

const createGoal = (index = 1) => ({
  id: `goal-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  goalName: index === 1 ? 'Child Education' : `Goal ${index}`,
  currentCost: 1000000,
  yearsToGoal: 10,
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
  const [goals, setGoals] = useState(() => [createGoal(1)]);
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0].id);

  const goalPlans = useMemo(
    () =>
      goals.map((goal) => ({
        goal,
        plan: calculateGoalPlan(sanitizeGoalInputs(goal)),
      })),
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

  const portfolioSummary = useMemo(
    () =>
      goalPlans.reduce(
        (acc, current) => ({
          monthlySIP: acc.monthlySIP + current.plan.requiredMonthlySIP,
          futureValue: acc.futureValue + current.plan.inflatedGoalValue,
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
    if (!selectedGoal) return [];

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
  }, [scenarioReturns, selectedGoal]);

  const addGoal = () => {
    const newGoal = createGoal(goals.length + 1);
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
    const value = field === 'goalName' ? rawValue : sanitizeNumber(rawValue);

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              [field]:
                field === 'yearsToGoal'
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
