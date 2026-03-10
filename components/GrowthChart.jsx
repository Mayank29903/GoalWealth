'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/financialHelpers';

const GrowthChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-neutral_grey/30 shadow-lg rounded text-sm">
          <p className="font-bold text-primary_blue mb-2">Year {label}</p>
          <p className="text-text_secondary mb-1">
            Invested: {formatCurrency(payload[0].value)}
          </p>
          <p className="font-bold text-primary_blue">
            Total Value: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]" role="img" aria-label="Investment growth line chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Years', position: 'insideBottom', offset: -5 }} 
            stroke="#64748b"
          />
          <YAxis 
            tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`} 
            stroke="#64748b"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="invested"
            stroke="#919090"
            strokeWidth={2}
            dot={false}
            name="Total Invested"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#224c87"
            strokeWidth={3}
            dot={false}
            name="Projected Value"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthChart;