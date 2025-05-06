import React from 'react';
import type { Grade } from '../types';

interface GradeChartProps {
  grades: Grade[];
}

export const GradeChart: React.FC<GradeChartProps> = ({ grades }) => {
  const sortedGrades = [...grades].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return '#4CAF50';
    if (grade >= 75) return '#2196F3';
    if (grade >= 60) return '#FFC107';
    return '#F44336';
  };

  const maxGrade = Math.max(...grades.map(g => g.value));
  const minGrade = Math.min(...grades.map(g => g.value));
  const range = maxGrade - minGrade;
  const padding = range * 0.1;

  const points = sortedGrades.map((grade, index) => {
    const x = (index / (sortedGrades.length - 1)) * 100;
    const y = ((grade.value - (minGrade - padding)) / (range + padding * 2)) * 100;
    return `${x},${100 - y}`;
  }).join(' ');

  return (
    <div className="info-card">
      <h3 className="text-lg font-semibold mb-4">Динаміка успішності</h3>
      <div className="relative h-48">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >

          <line x1="0" y1="0" x2="100" y2="0" stroke="#E0E0E0" strokeWidth="0.5" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="#E0E0E0" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#E0E0E0" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#E0E0E0" strokeWidth="0.5" />
          <line x1="0" y1="100" x2="100" y2="100" stroke="#E0E0E0" strokeWidth="0.5" />

          <polyline
            points={points}
            fill="none"
            stroke="#2196F3"
            strokeWidth="2"
          />

          {sortedGrades.map((grade, index) => {
            const x = (index / (sortedGrades.length - 1)) * 100;
            const y = ((grade.value - (minGrade - padding)) / (range + padding * 2)) * 100;
            return (
              <g key={grade.id}>
                <circle
                  cx={x}
                  cy={100 - y}
                  r="2"
                  fill={getGradeColor(grade.value)}
                />
                <text
                  x={x}
                  y={100 - y - 5}
                  fontSize="3"
                  textAnchor="middle"
                  fill="#666"
                >
                  {grade.value}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>{maxGrade}</span>
          <span>{Math.round((maxGrade + minGrade) / 2)}</span>
          <span>{minGrade}</span>
        </div>
      </div>
    </div>
  );
}; 