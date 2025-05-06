import React from 'react';
import type { Grade } from '../types';

interface GradeCalendarProps {
  grades: Grade[];
}

export const GradeCalendar: React.FC<GradeCalendarProps> = ({ grades }) => {
  const months = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return '#4CAF50';
    if (grade >= 75) return '#2196F3';
    if (grade >= 60) return '#FFC107';
    return '#F44336';
  };

  const groupGradesByMonth = () => {
    const gradesByMonth: { [key: string]: Grade[] } = {};
    
    grades.forEach(grade => {
      const date = new Date(grade.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!gradesByMonth[monthKey]) {
        gradesByMonth[monthKey] = [];
      }
      
      gradesByMonth[monthKey].push(grade);
    });

    return gradesByMonth;
  };

  const gradesByMonth = groupGradesByMonth();

  return (
    <div className="info-card">
      <h3 className="text-lg font-semibold mb-4">Календар оцінок</h3>
      <div className="space-y-4">
        {Object.entries(gradesByMonth).map(([monthKey, monthGrades]) => {
          const [year, month] = monthKey.split('-').map(Number);
          const monthName = months[month];

          return (
            <div key={monthKey} className="animate-fade-in">
              <h4 className="text-sm font-medium mb-2">
                {monthName} {year}
              </h4>
              <div className="flex flex-wrap gap-2">
                {monthGrades.map(grade => {
                  const date = new Date(grade.date);
                  return (
                    <div
                      key={grade.id}
                      className="relative group"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium transition-transform hover:scale-110"
                        style={{ backgroundColor: getGradeColor(grade.value) }}
                      >
                        {date.getDate()}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {grade.value} балів ({grade.type === 'lecture' ? 'Лекція' : 'Практика'})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 