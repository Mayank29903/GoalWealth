import { buildGrowthChartData, buildTimelineData } from '@/lib/chartData';

export const calculateInflatedValue = (presentCost, inflationRate, years) => {
  const rate = inflationRate / 100;
  return presentCost * Math.pow(1 + rate, years);
};

export const calculateRequiredSIP = (futureValue, annualReturn, years) => {
  const monthlyRate = annualReturn / 1200;
  const totalMonths = Math.max(1, Math.round(years * 12));

  if (monthlyRate <= 0) return futureValue / totalMonths;

  const growthFactor = Math.pow(1 + monthlyRate, totalMonths);
  const denominator = ((growthFactor - 1) / monthlyRate) * (1 + monthlyRate);
  return denominator === 0 ? 0 : futureValue / denominator;
};

export const generateYearlyBreakdown = (monthlySIP, annualReturn, years) => {
  const monthlyRate = annualReturn / 1200;
  const rows = [];

  for (let year = 1; year <= years; year += 1) {
    const months = year * 12;
    const totalInvested = monthlySIP * months;

    let expectedValue = totalInvested;
    if (monthlyRate > 0) {
      expectedValue =
        monthlySIP *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);
    }

    rows.push({
      year,
      totalInvested: Math.round(totalInvested),
      expectedValue: Math.round(expectedValue),
      estimatedGain: Math.round(expectedValue - totalInvested),
    });
  }

  return rows;
};

export const calculateGoalPlan = (inputs) => {
  const { currentCost, years, inflationRate, expectedReturn } = inputs;
  const safeYears = Math.max(1, Math.round(years || 1));

  const inflatedGoalValue = calculateInflatedValue(
    currentCost,
    inflationRate,
    safeYears
  );

  const requiredMonthlySIP = calculateRequiredSIP(
    inflatedGoalValue,
    expectedReturn,
    safeYears
  );

  const totalInvestedAmount = requiredMonthlySIP * safeYears * 12;
  const estimatedReturns = inflatedGoalValue - totalInvestedAmount;

  const yearlyBreakdown = generateYearlyBreakdown(
    requiredMonthlySIP,
    expectedReturn,
    safeYears
  );

  return {
    inflatedGoalValue,
    requiredMonthlySIP,
    totalInvestedAmount,
    estimatedReturns,
    yearlyBreakdown,
    growthData: buildGrowthChartData(yearlyBreakdown),
    timelineData: buildTimelineData({
      years: safeYears,
      currentCost,
      inflatedGoalValue,
      yearlyBreakdown,
    }),
  };
};
