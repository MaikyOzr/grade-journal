import React from 'react';

interface AverageGradeProps {
  value: number;
  size?: 'small' | 'medium' | 'large';
}

export const AverageGrade: React.FC<AverageGradeProps> = ({ value, size = 'medium' }) => {
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return '#4caf50';
    if (grade >= 75) return '#2196f3';
    if (grade >= 60) return '#ff9800';
    return '#f44336';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8 text-sm';
      case 'large':
        return 'w-16 h-16 text-2xl';
      default:
        return 'w-12 h-12 text-lg';
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        className={`${getSizeClass()} rounded-full flex items-center justify-center font-bold text-white`}
        style={{ backgroundColor: getGradeColor(value) }}
      >
        {value.toFixed(1)}
      </div>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${getGradeColor(value)} ${value}%, transparent ${value}%)`,
          transform: 'rotate(-90deg)',
        }}
      />
    </div>
  );
}; 