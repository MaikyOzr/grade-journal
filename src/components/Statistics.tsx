import React from 'react';
import type { Grade } from '../types';
import { ProgressBar } from './ProgressBar';

interface StatisticsProps {
  grades: Grade[];
}

export const Statistics: React.FC<StatisticsProps> = ({ grades }) => {
  const calculateStatistics = () => {
    const totalGrades = grades.length;
    const excellent = grades.filter(grade => grade.value >= 90).length;
    const good = grades.filter(grade => grade.value >= 75 && grade.value < 90).length;
    const satisfactory = grades.filter(grade => grade.value >= 60 && grade.value < 75).length;
    const poor = grades.filter(grade => grade.value < 60).length;

    return {
      total: totalGrades,
      excellent: (excellent / totalGrades) * 100 || 0,
      good: (good / totalGrades) * 100 || 0,
      satisfactory: (satisfactory / totalGrades) * 100 || 0,
      poor: (poor / totalGrades) * 100 || 0
    };
  };

  const stats = calculateStatistics();

  return (
    <div className="info-card">
      <h3 className="text-lg font-semibold mb-4">Статистика оцінок</h3>
      <div className="space-y-4">
        <ProgressBar
          value={stats.excellent}
          max={100}
          color="#4CAF50"
          label="Відмінно (90-100)"
        />
        <ProgressBar
          value={stats.good}
          max={100}
          color="#2196F3"
          label="Добре (75-89)"
        />
        <ProgressBar
          value={stats.satisfactory}
          max={100}
          color="#FFC107"
          label="Задовільно (60-74)"
        />
        <ProgressBar
          value={stats.poor}
          max={100}
          color="#F44336"
          label="Незадовільно (0-59)"
        />
      </div>
    </div>
  );
}; 