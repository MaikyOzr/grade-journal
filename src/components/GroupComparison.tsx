import React from 'react';
import type { Grade } from '../types';

interface GroupComparisonProps {
  studentGrades: Grade[];
  groupAverages: {
    [courseId: string]: {
      lectureAverage: number;
      practiceAverage: number;
      totalAverage: number;
    };
  };
}

export const GroupComparison: React.FC<GroupComparisonProps> = ({
  studentGrades,
  groupAverages
}) => {
  const calculateStudentAverages = () => {
    const averages: {
      [courseId: string]: {
        lectureAverage: number;
        practiceAverage: number;
        totalAverage: number;
      };
    } = {};

    const courseIds = [...new Set(studentGrades.map(grade => grade.courseId))];

    courseIds.forEach(courseId => {
      const courseGrades = studentGrades.filter(grade => grade.courseId === courseId);
      const lectureGrades = courseGrades.filter(grade => grade.type === 'lecture');
      const practiceGrades = courseGrades.filter(grade => grade.type === 'practice');

      averages[courseId] = {
        lectureAverage: lectureGrades.reduce((sum, grade) => sum + grade.value, 0) / lectureGrades.length || 0,
        practiceAverage: practiceGrades.reduce((sum, grade) => sum + grade.value, 0) / practiceGrades.length || 0,
        totalAverage: courseGrades.reduce((sum, grade) => sum + grade.value, 0) / courseGrades.length || 0
      };
    });

    return averages;
  };

  const studentAverages = calculateStudentAverages();

  const getComparisonColor = (studentValue: number, groupValue: number) => {
    const difference = studentValue - groupValue;
    if (difference >= 10) return '#4CAF50';
    if (difference >= 0) return '#2196F3';
    if (difference >= -10) return '#FFC107';
    return '#F44336';
  };

  return (
    <div className="info-card">
      <h3 className="text-lg font-semibold mb-4">Порівняння з групою</h3>
      <div className="space-y-6">
        {Object.entries(studentAverages).map(([courseId, averages]) => {
          const groupAverage = groupAverages[courseId];
          if (!groupAverage) return null;

          return (
            <div key={courseId} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Лекції</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{averages.lectureAverage.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">/</span>
                  <span
                    className="text-sm"
                    style={{ color: getComparisonColor(averages.lectureAverage, groupAverage.lectureAverage) }}
                  >
                    {groupAverage.lectureAverage.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Практики</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{averages.practiceAverage.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">/</span>
                  <span
                    className="text-sm"
                    style={{ color: getComparisonColor(averages.practiceAverage, groupAverage.practiceAverage) }}
                  >
                    {groupAverage.practiceAverage.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-sm font-medium">Загальний бал</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{averages.totalAverage.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">/</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: getComparisonColor(averages.totalAverage, groupAverage.totalAverage) }}
                  >
                    {groupAverage.totalAverage.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 