
'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import type { WeeklyActivityData } from '@/types/analytics';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface WeeklyOnlineActivityProps {
  activity: WeeklyActivityData;
}

const WeeklyOnlineActivity = ({ activity }: WeeklyOnlineActivityProps) => {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Weekly Online Activity' },
    },
  };

  return <Line options={options} data={activity} />;
};

export default WeeklyOnlineActivity;
