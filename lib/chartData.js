export const buildGrowthChartData = (yearlyBreakdown = []) =>
  yearlyBreakdown.map((row) => ({
    year: row.year,
    invested: Math.round(row.totalInvested),
    returns: Math.round(row.estimatedGain),
    corpus: Math.round(row.expectedValue),
  }));

export const buildTimelineData = ({
  years,
  currentCost,
  inflatedGoalValue,
  yearlyBreakdown = [],
}) => {
  const safeYears = Math.max(1, Math.round(years || 1));
  const checkpoints = [
    0,
    Math.max(1, Math.round(safeYears * 0.25)),
    Math.max(1, Math.round(safeYears * 0.5)),
    Math.max(1, Math.round(safeYears * 0.75)),
    safeYears,
  ];

  const uniqueCheckpoints = [...new Set(checkpoints)].sort((a, b) => a - b);

  return uniqueCheckpoints.map((yearPoint) => {
    const row = yearPoint > 0 ? yearlyBreakdown[yearPoint - 1] : null;
    const progress = yearPoint / safeYears;

    let stageLabel = 'Planned';
    if (progress >= 1) stageLabel = 'Goal Due';
    else if (progress >= 0.75) stageLabel = 'Late Stage';
    else if (progress >= 0.5) stageLabel = 'Mid Course';
    else if (progress > 0) stageLabel = 'Early Stage';

    return {
      year: yearPoint,
      stageLabel,
      corpus:
        yearPoint === 0
          ? Math.round(currentCost || 0)
          : Math.round(row?.expectedValue || 0),
      invested: yearPoint === 0 ? 0 : Math.round(row?.totalInvested || 0),
      targetValue:
        yearPoint === safeYears ? Math.round(inflatedGoalValue || 0) : undefined,
    };
  });
};
