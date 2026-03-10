const calculateInflatedValue = (presentCost, inflationRate, years) => {
  const rate = inflationRate / 100;
  return presentCost * Math.pow(1 + rate, years);
};

const calculateRequiredSIP = (futureValue, annualReturn, years) => {
  const monthlyRate = (annualReturn / 100) / 12;
  const totalMonths = years * 12;

  if (monthlyRate === 0) return futureValue / totalMonths;

  const numerator = futureValue * monthlyRate;
  const denominator =
    (Math.pow(1 + monthlyRate, totalMonths) - 1) * (1 + monthlyRate);

  return numerator / denominator;
};

const generateGrowthData = (monthlySIP, annualReturn, years) => {
  const monthlyRate = (annualReturn / 100) / 12;
  const data = [];
  
  let accumulatedValue = 0;
  let totalInvested = 0;

  for (let i = 1; i <= years; i++) {
    const months = i * 12;
    accumulatedValue =
      monthlySIP *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);
    
    totalInvested = monthlySIP * months;

    data.push({
      year: i,
      invested: Math.round(totalInvested),
      value: Math.round(accumulatedValue),
    });
  }

  return data;
};

export const calculateGoalPlan = (inputs) => {
  const { currentCost, years, inflationRate, expectedReturn } = inputs;

  const inflatedGoalValue = calculateInflatedValue(
    currentCost,
    inflationRate,
    years
  );

  const requiredMonthlySIP = calculateRequiredSIP(
    inflatedGoalValue,
    expectedReturn,
    years
  );

  const totalInvestedAmount = requiredMonthlySIP * years * 12;
  const estimatedReturns = inflatedGoalValue - totalInvestedAmount;

  const growthData = generateGrowthData(
    requiredMonthlySIP,
    expectedReturn,
    years
  );

  return {
    inflatedGoalValue,
    requiredMonthlySIP,
    totalInvestedAmount,
    estimatedReturns,
    growthData,
  };
};