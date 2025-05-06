import React, { useState } from 'react';
import type { Student, Course } from '../types';
import { AverageGrade } from './AverageGrade';
import { Statistics } from './Statistics';
import { GradeChart } from './GradeChart';
import { CourseProgress } from './CourseProgress';
import { GradeCalendar } from './GradeCalendar';
import { AttendanceStats } from './AttendanceStats';
import { StudentRank } from './StudentRank';
import { GroupComparison } from './GroupComparison';
import { Recommendations } from './Recommendations';

interface StudentPortalProps {
  student: Student;
  courses: Course[];
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ student, courses }) => {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  if (!student || !student.firstName || !student.lastName || !student.group) {
    return (
      <div className="journal-container">
        <div className="text-center py-12 text-red-600 text-lg font-semibold">
          Дані про студента відсутні або некоректні.
        </div>
      </div>
    );
  }
  if (!Array.isArray(courses)) {
    return (
      <div className="journal-container">
        <div className="text-center py-12 text-red-600 text-lg font-semibold">
          Дані про курси відсутні або некоректні.
        </div>
      </div>
    );
  }
  if (!Array.isArray(student.grades)) {
    return (
      <div className="journal-container">
        <div className="text-center py-12 text-red-600 text-lg font-semibold">
          Дані про оцінки відсутні або некоректні.
        </div>
      </div>
    );
  }
  if (courses.length === 0) {
    return (
      <div className="journal-container">
        <div className="text-center py-12 text-gray-500 text-lg font-semibold">
          Немає доступних курсів для відображення.
        </div>
      </div>
    );
  }
  if (student.grades.length === 0) {
    return (
      <div className="journal-container">
        <div className="text-center py-12 text-gray-500 text-lg font-semibold">
          Оцінки ще не додані. Зверніться до викладача.
        </div>
      </div>
    );
  }

  const calculateOverallAverage = () => {
    const grades = student.grades.map(grade => grade.value);
    if (grades.length === 0) return 0;
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
  };

  const filteredCourses = courses.filter(course => course.semester === selectedSemester);
  const semesterGrades = student.grades.filter(
    grade => filteredCourses.some(course => course.id === grade.courseId)
  );

  const mockGroupAverages = {
    '1': {
      lectureAverage: 85,
      practiceAverage: 82,
      totalAverage: 83.5
    },
    '2': {
      lectureAverage: 78,
      practiceAverage: 80,
      totalAverage: 79
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'excellent';
    if (grade >= 75) return 'good';
    if (grade >= 60) return 'satisfactory';
    return 'poor';
  };

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h1 className="text-2xl font-bold mb-4">Студентський журнал</h1>
        <div className="student-info">
          <div className="info-card">
            <h2 className="text-xl font-semibold mb-2">
              {student.lastName} {student.firstName}
            </h2>
            <p className="text-gray-600">Група: {student.group}</p>
          </div>
          <div className="info-card">
            <h3 className="text-lg font-semibold mb-2">Середній бал</h3>
            <div className="flex items-center justify-center">
              <AverageGrade value={calculateOverallAverage()} size="large" />
            </div>
          </div>
          <StudentRank grades={semesterGrades} totalStudents={30} />
          <Statistics grades={semesterGrades} />
          <GradeChart grades={semesterGrades} />
          <GradeCalendar grades={semesterGrades} />
          <AttendanceStats grades={semesterGrades} />
          <GroupComparison
            studentGrades={semesterGrades}
            groupAverages={mockGroupAverages}
          />
          <Recommendations grades={student.grades} />
        </div>
      </div>

      <div className="mb-6">
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(Number(e.target.value))}
          className="w-full max-w-xs"
        >
          <option value={1}>Семестр 1</option>
          <option value={2}>Семестр 2</option>
        </select>
      </div>

      {filteredCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredCourses.map((course) => (
              <CourseProgress
                key={course.id}
                course={course}
                grades={student.grades}
              />
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Назва курсу</th>
                  <th>Викладач</th>
                  <th>Лекції</th>
                  <th>Практики</th>
                  <th>Середній бал</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => {
                  const courseGrades = student.grades.filter(
                    (grade) => grade.courseId === course.id
                  );
                  const lectureGrades = courseGrades.filter(
                    (grade) => grade.type === 'lecture'
                  );
                  const practiceGrades = courseGrades.filter(
                    (grade) => grade.type === 'practice'
                  );
                  const averageGrade =
                    courseGrades.reduce((sum, grade) => sum + grade.value, 0) /
                    courseGrades.length || 0;

                  return (
                    <tr key={course.id}>
                      <td>{course.name}</td>
                      <td>
                        {course.teacher.lastName} {course.teacher.firstName}
                      </td>
                      <td>
                        {lectureGrades.map((grade) => (
                          <span
                            key={grade.id}
                            className={`grade-badge ${getGradeColor(
                              grade.value
                            )} mr-2`}
                          >
                            {grade.value}
                          </span>
                        ))}
                      </td>
                      <td>
                        {practiceGrades.map((grade) => (
                          <span
                            key={grade.id}
                            className={`grade-badge ${getGradeColor(
                              grade.value
                            )} mr-2`}
                          >
                            {grade.value}
                          </span>
                        ))}
                      </td>
                      <td>
                        <AverageGrade value={averageGrade} size="small" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Немає курсів для вибраного семестру
        </div>
      )}
    </div>
  );
}; 