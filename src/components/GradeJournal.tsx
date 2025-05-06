import React, { useState } from 'react';
import type { Student, Course, Teacher } from '../types';

interface GradeJournalProps {
  students: Student[];
  courses: Course[];
  teachers: Teacher[];
}

export const GradeJournal: React.FC<GradeJournalProps> = ({ students, courses, teachers }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.id || '');
  const [selectedTeacher, setSelectedTeacher] = useState<string>(teachers[0]?.id || '');

  const selectedCourseData = courses.find(course => course.id === selectedCourse);
  const selectedTeacherData = teachers.find(teacher => teacher.id === selectedTeacher);

  const getGradeColor = (grade: number): string => {
    if (grade >= 90) return 'text-success-color';
    if (grade >= 75) return 'text-accent-color';
    if (grade >= 60) return 'text-warning-color';
    return 'text-danger-color';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="journal-container">
        <div className="journal-header">
          <h1>Журнал викладача</h1>
        </div>

        <div className="student-info">
          <div className="student-info-grid">
            <div className="info-item">
              <div className="info-label">Викладач</div>
              <div className="info-value">
                {selectedTeacherData ? `${selectedTeacherData.lastName} ${selectedTeacherData.firstName}` : '-'}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Кафедра</div>
              <div className="info-value">{selectedTeacherData?.department || '-'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Курс</div>
              <div className="info-value">{selectedCourseData?.name || '-'}</div>
            </div>
          </div>
        </div>

        <div className="semester-select">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="info-label block mb-2">Виберіть викладача</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full"
              >
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {`${teacher.lastName} ${teacher.firstName}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="info-label block mb-2">Виберіть курс</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full"
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="grades-table">
            <thead>
              <tr>
                <th className="min-w-[200px]">Студент</th>
                <th className="min-w-[100px]">Група</th>
                <th className="min-w-[150px]">Лекції</th>
                <th className="min-w-[150px]">Практики</th>
                <th className="min-w-[120px]">Середній бал</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const courseGrades = student.grades.filter(grade => grade.courseId === selectedCourse);
                const lectureGrades = courseGrades
                  .filter(grade => grade.type === 'lecture')
                  .map(grade => grade.value);
                const practiceGrades = courseGrades
                  .filter(grade => grade.type === 'practice')
                  .map(grade => grade.value);
                const averageGrade = lectureGrades.length > 0 || practiceGrades.length > 0
                  ? Math.round(([...lectureGrades, ...practiceGrades].reduce((a, b) => a + b, 0)) / 
                    ([...lectureGrades, ...practiceGrades].length))
                  : 0;

                return (
                  <tr key={student.id}>
                    <td className="font-medium">{`${student.lastName} ${student.firstName}`}</td>
                    <td>{student.group}</td>
                    <td className="grade-cell">
                      {lectureGrades.map((grade, index) => (
                        <span key={index} className={`grade-lecture ${getGradeColor(grade)}`}>
                          {grade}
                        </span>
                      ))}
                    </td>
                    <td className="grade-cell">
                      {practiceGrades.map((grade, index) => (
                        <span key={index} className={`grade-practice ${getGradeColor(grade)}`}>
                          {grade}
                        </span>
                      ))}
                    </td>
                    <td className={`grade-average ${getGradeColor(averageGrade)}`}>
                      {averageGrade || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 