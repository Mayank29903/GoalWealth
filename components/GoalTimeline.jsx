import React from 'react';
import { formatCurrency } from '@/utils/financialHelpers';

const GoalTimeline = ({ years, inflatedValue, currentValue }) => {
  const markers = [
    { year: 0, value: currentValue, label: 'Present' },
    { year: Math.ceil(years / 2), value: null, label: 'Midpoint' },
    { year: years, value: inflatedValue, label: 'Goal Date' },
  ];

  return (
    <div className="relative pt-6 pb-2" aria-label="Goal timeline visualization">
      <div className="absolute top-8 left-0 w-full h-1 bg-neutral_grey/30 rounded"></div>
      
      <div className="relative flex justify-between w-full">
        {markers.map((marker, index) => (
          <div key={index} className="flex flex-col items-center z-10">
            <div className={`w-4 h-4 rounded-full border-2 ${index === 2 ? 'bg-accent_red border-accent_red' : 'bg-white border-primary_blue'}`}></div>
            <div className="mt-4 text-center">
              <p className="text-sm font-bold text-primary_blue">Year {marker.year}</p>
              <p className="text-xs text-text_secondary">{marker.label}</p>
              {marker.value !== null && (
                <p className="text-xs font-semibold text-text_primary mt-1">
                  {formatCurrency(marker.value)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-sm text-text_secondary">
        <p>Time Horizon: {years} Years</p>
      </div>
    </div>
  );
};

export default GoalTimeline;