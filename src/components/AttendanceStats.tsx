import React from 'react';
import type { Grade } from '../types';
import { ProgressBar } from './ProgressBar';

interface AttendanceStatsProps {
  grades: Grade[];
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ grades }) => {
  const calculateAttendance = () => {
    const lectureGrades = grades.filter(grade => grade.type === 'lecture');
    const practiceGrades = grades.filter(grade => grade.type === 'practice');

    const totalLectures = 15;
    const totalPractices = 15;

    return {
      lectures: {
        attended: lectureGrades.length,
        total: totalLectures,
        percentage: (lectureGrades.length / totalLectures) * 100
      },
      practices: {
        attended: practiceGrades.length,
        total: totalPractices,
        percentage: (practiceGrades.length / totalPractices) * 100
      }
    };
  };

  const attendance = calculateAttendance();

  return (
    <div className="info-card">
      <h3 className="text-lg font-semibold mb-4">Відвідуваність</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Лекції</span>
            <span className="text-sm font-medium">
              {attendance.lectures.attended}/{attendance.lectures.total}
            </span>
          </div>
          <ProgressBar
            value={attendance.lectures.percentage}
            max={100}
            color="#2196F3"
            showLabel={false}
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Практики</span>
            <span className="text-sm font-medium">
              {attendance.practices.attended}/{attendance.practices.total}
            </span>
          </div>
          <ProgressBar
            value={attendance.practices.percentage}
            max={100}
            color="#4CAF50"
            showLabel={false}
          />
        </div>
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span>Загальна відвідуваність</span>
            <span className="font-medium">
              {Math.round(
                ((attendance.lectures.attended + attendance.practices.attended) /
                  (attendance.lectures.total + attendance.practices.total)) *
                  100
              )}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 