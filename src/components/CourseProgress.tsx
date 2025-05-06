import React from 'react';
import type { Course, Grade } from '../types';
import { ProgressBar } from './ProgressBar';

interface CourseProgressProps {
  course: Course;
  grades: Grade[];
}

export const CourseProgress: React.FC<CourseProgressProps> = ({ course, grades }) => {
  const courseGrades = grades.filter(grade => grade.courseId === course.id);
  const lectureGrades = courseGrades.filter(grade => grade.type === 'lecture');
  const practiceGrades = courseGrades.filter(grade => grade.type === 'practice');

  const calculateAverage = (grades: Grade[]) => {
    if (grades.length === 0) return 0;
    return grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length;
  };

  const lectureAverage = calculateAverage(lectureGrades);
  const practiceAverage = calculateAverage(practiceGrades);
  const overallAverage = calculateAverage(courseGrades);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return '#4CAF50';
    if (grade >= 75) return '#2196F3';
    if (grade >= 60) return '#FFC107';
    return '#F44336';
  };

  return (
    <div className="info-card">
      <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
      <p className="text-sm text-gray-600 mb-4">
        {course.teacher.lastName} {course.teacher.firstName}
      </p>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Лекції</span>
            <span className="text-sm font-medium">{lectureAverage.toFixed(1)}</span>
          </div>
          <ProgressBar
            value={lectureAverage}
            max={100}
            color={getGradeColor(lectureAverage)}
            showLabel={false}
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Практики</span>
            <span className="text-sm font-medium">{practiceAverage.toFixed(1)}</span>
          </div>
          <ProgressBar
            value={practiceAverage}
            max={100}
            color={getGradeColor(practiceAverage)}
            showLabel={false}
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Загальний бал</span>
            <span className="text-sm font-medium">{overallAverage.toFixed(1)}</span>
          </div>
          <ProgressBar
            value={overallAverage}
            max={100}
            color={getGradeColor(overallAverage)}
            showLabel={false}
          />
        </div>
      </div>
    </div>
  );
}; 