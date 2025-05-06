import React from 'react';
import type { Grade } from '../types';

interface RecommendationsProps {
  grades: Grade[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({ grades }) => {
  const analyzeGrades = () => {
    const lectureGrades = grades.filter(grade => grade.type === 'lecture');
    const practiceGrades = grades.filter(grade => grade.type === 'practice');

    const lectureAverage = lectureGrades.reduce((sum, grade) => sum + grade.value, 0) / lectureGrades.length || 0;
    const practiceAverage = practiceGrades.reduce((sum, grade) => sum + grade.value, 0) / practiceGrades.length || 0;

    const recommendations: string[] = [];

    if (lectureGrades.length < 10) {
      recommendations.push('Збільшіть відвідуваність лекцій для кращого розуміння матеріалу');
    }
    if (practiceGrades.length < 10) {
      recommendations.push('Приділіть більше уваги практичним заняттям для закріплення знань');
    }

    if (lectureAverage < 75) {
      recommendations.push('Покращіть підготовку до лекційних занять');
    }
    if (practiceAverage < 75) {
      recommendations.push('Збільшіть час на практичну підготовку');
    }

    const sortedGrades = [...grades].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    if (sortedGrades.length >= 2) {
      const recentGrades = sortedGrades.slice(-3);
      const recentAverage = recentGrades.reduce((sum, grade) => sum + grade.value, 0) / recentGrades.length;
      const overallAverage = grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length;

      if (recentAverage < overallAverage) {
        recommendations.push('Зверніть увагу на зниження успішності в останній період');
      }
    }

    return recommendations;
  };

  const recommendations = analyzeGrades();

  return (
    <div className="info-card">
      <h3 className="text-lg font-semibold mb-4">Рекомендації</h3>
      {recommendations.length > 0 ? (
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li
              key={index}
              className="flex items-start space-x-2 text-sm"
            >
              <span className="text-primary-color">•</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600">
          Продовжуйте підтримувати поточний рівень успішності!
        </p>
      )}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          * Рекомендації базуються на аналізі ваших оцінок та відвідуваності
        </p>
      </div>
    </div>
  );
}; 