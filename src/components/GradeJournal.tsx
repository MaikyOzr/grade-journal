import React, { useState } from 'react';
import type { Student, Course, Teacher, Grade } from '../types';
import ExcelImport from './ExcelImport';

interface GradeJournalProps {
  students: Student[];
  courses: Course[];
  teachers: Teacher[];
  onGradeEdit?: (studentId: string, courseId: string, type: 'lecture' | 'practice', newValue: number) => void;
}

export const GradeJournal: React.FC<GradeJournalProps> = ({ students, courses, teachers, onGradeEdit }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.id || '');
  const [selectedTeacher, setSelectedTeacher] = useState<string>(teachers[0]?.id || '');
  const [editState, setEditState] = useState<{[key: string]: number | undefined}>({});

  const selectedCourseData = courses.find(course => course.id === selectedCourse);
  const selectedTeacherData = teachers.find(teacher => teacher.id === selectedTeacher);

  const handleExcelImport = (data: any[]) => {
    const newStudents: Student[] = data.map((row, index) => ({
      id: String(index + 1),
      firstName: row['Ім\'я'] || '',
      lastName: row['Прізвище'] || '',
      group: row['Група'] || '',
      grades: [
        {
          id: String(index + 1),
          studentId: String(index + 1),
          courseId: selectedCourse,
          type: 'lecture',
          value: Number(row['Лекції']) || 0,
          date: new Date().toISOString().split('T')[0]
        },
        {
          id: String(index + 2),
          studentId: String(index + 1),
          courseId: selectedCourse,
          type: 'practice',
          value: Number(row['Практики']) || 0,
          date: new Date().toISOString().split('T')[0]
        }
      ]
    }));
    // setImportedStudents(newStudents);
  };

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

        <div className="excel-import-section">
          <ExcelImport onDataImport={handleExcelImport} />
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
              {students
                .filter(student => student.grades.some(grade => grade.courseId === selectedCourse))
                .map(student => {
                  const courseGrades = student.grades.filter(grade => grade.courseId === selectedCourse);
                  const lectureGrade = courseGrades.find(grade => grade.type === 'lecture');
                  const practiceGrade = courseGrades.find(grade => grade.type === 'practice');
                  const averageGrade = [lectureGrade, practiceGrade].filter(Boolean).length > 0
                    ? Math.round((([lectureGrade?.value || 0, practiceGrade?.value || 0].reduce((a, b) => a + b, 0)) /
                      ([lectureGrade, practiceGrade].filter(Boolean).length)) * 10) / 10
                    : 0;

                  return (
                    <tr key={student.id}>
                      <td className="font-medium">{`${student.lastName} ${student.firstName}`}</td>
                      <td>{student.group}</td>
                      <td className="grade-cell">
                        {lectureGrade ? (
                          <span className={`grade-lecture ${getGradeColor(lectureGrade.value)}`}>
                            {editState[`${student.id}_${selectedCourse}_lecture`] !== undefined ? (
                              <>
                                <input
                                  type="number"
                                  value={editState[`${student.id}_${selectedCourse}_lecture`]}
                                  onChange={e => setEditState(s => ({ ...s, [`${student.id}_${selectedCourse}_lecture`]: Number(e.target.value) }))}
                                  style={{ width: 50 }}
                                />
                                <button onClick={() => {
                                  if (onGradeEdit) onGradeEdit(student.id, selectedCourse, 'lecture', Number(editState[`${student.id}_${selectedCourse}_lecture`]));
                                  setEditState(s => ({ ...s, [`${student.id}_${selectedCourse}_lecture`]: undefined }));
                                }}>💾</button>
                                <button onClick={() => setEditState(s => ({ ...s, [`${student.id}_${selectedCourse}_lecture`]: undefined }))}>✖</button>
                              </>
                            ) : (
                              <>
                                {lectureGrade.value}
                                <button style={{ marginLeft: 8 }} onClick={() => setEditState(s => ({ ...s, [`${student.id}_${selectedCourse}_lecture`]: lectureGrade.value }))}>✏️</button>
                              </>
                            )}
                          </span>
                        ) : null}
                      </td>
                      <td className="grade-cell">
                        {practiceGrade ? (
                          <span className={`grade-practice ${getGradeColor(practiceGrade.value)}`}>
                            {editState[`${student.id}_${selectedCourse}_practice`] !== undefined ? (
                              <>
                                <input
                                  type="number"
                                  value={editState[`${student.id}_${selectedCourse}_practice`]}
                                  onChange={e => setEditState(s => ({ ...s, [`${student.id}_${selectedCourse}_practice`]: Number(e.target.value) }))}
                                  style={{ width: 50 }}
                                />
                                <button onClick={() => {
                                  if (onGradeEdit) onGradeEdit(student.id, selectedCourse, 'practice', Number(editState[`${student.id}_${selectedCourse}_practice`]));
                                  setEditState(s => ({ ...s, [`${student.id}_${selectedCourse}_practice`]: undefined }));
                                }}>💾</button>
                                <button onClick={() => setEditState(s => ({ ...s, [`${student.id}_${selectedCourse}_practice`]: undefined }))}>✖</button>
                              </>
                            ) : (
                              <>
                                {practiceGrade.value}
                                <button style={{ marginLeft: 8 }} onClick={() => setEditState(s => ({ ...s, [`${student.id}_${selectedCourse}_practice`]: practiceGrade.value }))}>✏️</button>
                              </>
                            )}
                          </span>
                        ) : null}
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