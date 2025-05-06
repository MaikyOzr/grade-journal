import React, { useState } from 'react';
import type { Grade } from '../types';

interface AddGradeFormProps {
  studentId: string;
  courseId: string;
  onSubmit: (grade: Omit<Grade, 'id'>) => void;
}

export const AddGradeForm: React.FC<AddGradeFormProps> = ({ studentId, courseId, onSubmit }) => {
  const [type, setType] = useState<'lecture' | 'practice'>('lecture');
  const [value, setValue] = useState<string>('');
  const [comments, setComments] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gradeValue = parseInt(value);
    if (gradeValue >= 0 && gradeValue <= 100) {
      onSubmit({
        studentId,
        courseId,
        type,
        value: gradeValue,
        date: new Date().toISOString(),
        comments: comments || undefined
      });
      setValue('');
      setComments('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Тип оцінки</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'lecture' | 'practice')}
          className="w-full p-2 border rounded"
        >
          <option value="lecture">Лекція</option>
          <option value="practice">Практична</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Оцінка (0-100)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Коментарі</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Додати оцінку
      </button>
    </form>
  );
}; 