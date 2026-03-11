'use client';

import { useEffect, useMemo, useState } from 'react';
import { calculateGoalPlan } from '@/utils/goalCalculator';
import { sanitizeNumber } from '@/utils/financialHelpers';

const DEFAULT_SCENARIOS = [10, 12, 15];
const SESSION_STORAGE_KEY = 'goalwealth:planner:session-v1';
const MAX_GOAL_COST = 1e13;
const MAX_MONTHLY_INCOME = 1e9;
const MAX_YEARS = 50;
const MAX_RATE = 30;
const MAX_INFLATION_RATE = 20;
const MAX_HEALTH_SIP_THRESHOLD = 80;
const MIN_HEALTH_SIP_THRESHOLD = 20;
const MAX_HEALTH_SHORT_HORIZON = 15;
const MIN_HEALTH_SHORT_HORIZON = 2;
const MAX_HEALTH_SAFETY_GAP = 8;
const MIN_HEALTH_SAFETY_GAP = 0;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const clampToSafeNumber = (value, min, max) => {
  const safeValue = sanitizeNumber(value);
  return clamp(safeValue, min, max);
};
const getGoalDefaults = () => ({
  goalName: '',
  currentCost: '',
  monthlyIncome: '',
  yearsToGoal: '',
  inflationRate: 6,
  expectedReturn: 12,
  healthSipThresholdPct: 40,
  healthShortHorizonYears: 5,
  healthSafetyGapPct: 2,
});

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
  ...getGoalDefaults(),
  ...(prefill
    ? {
        goalName: index === 1 ? 'Child Education' : `Goal ${index}`,
        currentCost: 1000000,
        monthlyIncome: 150000,
        yearsToGoal: 10,
      }
    : {}),
});

const normalizePersistedGoal = (goal) => ({
  id:
    typeof goal?.id === 'string' && goal.id.trim().length > 0
      ? goal.id
      : `goal-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  ...getGoalDefaults(),
  ...goal,
});

const loadSessionPlannerState = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.goals) || parsed.goals.length === 0) return null;

    const goals = parsed.goals.map(normalizePersistedGoal);
    const selectedGoalId =
      typeof parsed.selectedGoalId === 'string' &&
      goals.some((goal) => goal.id === parsed.selectedGoalId)
        ? parsed.selectedGoalId
        : goals[0].id;

    return { goals, selectedGoalId };
  } catch {
    return null;
  }
};

const getInitialPlannerState = () => {
  const sessionState = loadSessionPlannerState();
  if (sessionState) return sessionState;

  const firstGoal = createGoal({ prefill: false, index: 1 });
  return { goals: [firstGoal], selectedGoalId: firstGoal.id };
};

const sanitizeGoalInputs = (goal) => ({
  currentCost: clampToSafeNumber(goal.currentCost, 0, MAX_GOAL_COST),
  years: clampToSafeNumber(goal.yearsToGoal, 1, MAX_YEARS),
  inflationRate: clampToSafeNumber(goal.inflationRate, 0, MAX_INFLATION_RATE),
  expectedReturn: clampToSafeNumber(goal.expectedReturn, 0, MAX_RATE),
});

const useCalculator = () => {
  const [initialPlannerState] = useState(getInitialPlannerState);
  const [goals, setGoals] = useState(initialPlannerState.goals);
  const [selectedGoalId, setSelectedGoalId] = useState(initialPlannerState.selectedGoalId);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ goals, selectedGoalId })
      );
    } catch {
      // Ignore storage failures (private mode/storage limits) and keep app functional.
    }
  }, [goals, selectedGoalId]);

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
      rawValue === '' &&
      (field === 'currentCost' || field === 'yearsToGoal' || field === 'monthlyIncome');
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
                        : field === 'monthlyIncome'
                          ? clamp(value, 0, MAX_MONTHLY_INCOME)
                        : field === 'healthSipThresholdPct'
                          ? clamp(value, MIN_HEALTH_SIP_THRESHOLD, MAX_HEALTH_SIP_THRESHOLD)
                        : field === 'healthShortHorizonYears'
                          ? clamp(value, MIN_HEALTH_SHORT_HORIZON, MAX_HEALTH_SHORT_HORIZON)
                        : field === 'healthSafetyGapPct'
                          ? clamp(value, MIN_HEALTH_SAFETY_GAP, MAX_HEALTH_SAFETY_GAP)
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
