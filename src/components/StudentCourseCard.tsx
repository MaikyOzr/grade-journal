import React from 'react';
import type { Course, Grade } from '../types';

interface StudentCourseCardProps {
  course: Course;
  grades: Grade[];
}

export const StudentCourseCard: React.FC<StudentCourseCardProps> = ({ course, grades }) => {
  const lectureGrades = grades.filter(grade => grade.type === 'lecture');
  const practiceGrades = grades.filter(grade => grade.type === 'practice');

  const calculateAverage = (grades: Grade[]) => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.value, 0);
    return Math.round(sum / grades.length);
  };

  const getGradeColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 75) return 'text-blue-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{course.name}</h3>
            <p className="text-gray-600">
              Викладач: {course.teacher.lastName} {course.teacher.firstName}
            </p>
            <p className="text-sm text-gray-500">
              Семестр: {course.semester}, {course.year}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getGradeColor(calculateAverage(grades))}`}>
                {calculateAverage(grades)}
              </div>
              <div className="text-sm text-gray-500">Середній бал</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        <div className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Лекції
          </h4>
          <div className="space-y-3">
            {lectureGrades.map(grade => (
              <div key={grade.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">
                    {new Date(grade.date).toLocaleDateString('uk-UA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  {grade.comments && (
                    <div className="text-xs text-gray-500 mt-1">{grade.comments}</div>
                  )}
                </div>
                <div className={`text-lg font-semibold ${getGradeColor(grade.value)}`}>
                  {grade.value}
                </div>
              </div>
            ))}
            {lectureGrades.length === 0 && (
              <p className="text-gray-500 text-center py-2">Немає оцінок</p>
            )}
          </div>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Практичні
          </h4>
          <div className="space-y-3">
            {practiceGrades.map(grade => (
              <div key={grade.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">
                    {new Date(grade.date).toLocaleDateString('uk-UA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  {grade.comments && (
                    <div className="text-xs text-gray-500 mt-1">{grade.comments}</div>
                  )}
                </div>
                <div className={`text-lg font-semibold ${getGradeColor(grade.value)}`}>
                  {grade.value}
                </div>
              </div>
            ))}
            {practiceGrades.length === 0 && (
              <p className="text-gray-500 text-center py-2">Немає оцінок</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 