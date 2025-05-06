import React from 'react';
import type { Grade } from '../types';

interface StudentRankProps {
  grades: Grade[];
  totalStudents: number;
}

export const StudentRank: React.FC<StudentRankProps> = ({ grades, totalStudents }) => {
  const calculateRank = () => {
    const average = grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length || 0;
    
    const rank = Math.ceil((average / 100) * totalStudents);
    
    return {
      rank,
      percentile: ((totalStudents - rank + 1) / totalStudents) * 100,
      average
    };
  };

  const rankInfo = calculateRank();

  const getRankText = (percentile: number) => {
    if (percentile >= 90) return 'Відмінно';
    if (percentile >= 75) return 'Добре';
    if (percentile >= 50) return 'Задовільно';
    return 'Потребує покращення';
  };

  const getRankColor = (percentile: number) => {
    if (percentile >= 90) return '#4CAF50';
    if (percentile >= 75) return '#2196F3';
    if (percentile >= 50) return '#FFC107';
    return '#F44336';
  };

  return (
    <div className="info-card">
      <h3 className="text-lg font-semibold mb-4">Рейтинг</h3>
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4"
          style={{ backgroundColor: getRankColor(rankInfo.percentile) }}
        >
          {rankInfo.rank}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">
            з {totalStudents} студентів
          </p>
          <p className="font-medium" style={{ color: getRankColor(rankInfo.percentile) }}>
            {getRankText(rankInfo.percentile)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Топ {Math.round(rankInfo.percentile)}%
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Середній бал</span>
          <span className="font-medium">{rankInfo.average.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}; 