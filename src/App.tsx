import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { StudentPortal } from './components/StudentPortal';
import { GradeJournal } from './components/GradeJournal';
import { ThemeToggle } from './components/ThemeToggle';
import type { Student, Course, Grade, Teacher } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader } from './components/Loader';
import AdminPanel from './components/AdminPanel';

const initialStudents: Student[] = [
  {
    id: '1',
    firstName: 'Іван',
    lastName: 'Петренко',
    group: 'КН-101',
    grades: [
      {
        id: '1',
        studentId: '1',
        courseId: '1',
        type: 'lecture',
        value: 85,
        date: '2024-03-15'
      },
      {
        id: '2',
        studentId: '1',
        courseId: '1',
        type: 'practice',
        value: 90,
        date: '2024-03-16'
      }
    ]
  }
];

const initialCourses: Course[] = [
  {
    id: '1',
    name: 'Програмування',
    teacher: {
      id: '1',
      firstName: 'Марія',
      lastName: 'Іваненко',
      department: 'Комп\'ютерні науки'
    },
    semester: 1,
    year: 2024
  },
  {
    id: '2',
    name: 'Математика',
    teacher: {
      id: '2',
      firstName: 'Олександр',
      lastName: 'Коваленко',
      department: 'Математика'
    },
    semester: 1,
    year: 2024
  }
];

const initialTeachers: Teacher[] = [
  {
    id: '1',
    firstName: 'Марія',
    lastName: 'Іваненко',
    department: 'Комп\'ютерні науки'
  },
  {
    id: '2',
    firstName: 'Олександр',
    lastName: 'Коваленко',
    department: 'Математика'
  }
];

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="text-xl font-bold text-primary-color">Університетський журнал</div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Студентський портал
          </Link>
          <Link 
            to="/journal" 
            className={`nav-link ${location.pathname === '/journal' ? 'active' : ''}`}
          >
            Журнал викладача
          </Link>
          <Link
            to="/admin"
            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            Адмін-панель
          </Link>
        </div>
      </div>
    </nav>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="loading-spinner" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={300}
        classNames="page"
      >
        <Suspense fallback={<Loader />}>
          <Routes location={location}>
            <Route 
              path="/" 
              element={<StudentPortal student={initialStudents[0]} courses={initialCourses} />} 
            />
            <Route 
              path="/journal" 
              element={<GradeJournal students={initialStudents} courses={initialCourses} teachers={initialTeachers} />} 
            />
            <Route 
              path="/admin" 
              element={<AdminPanel onUniversalImport={() => {}} />} 
            />
          </Routes>
        </Suspense>
      </CSSTransition>
    </TransitionGroup>
  );
};

function App() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');

  // Universal import handler
  const handleUniversalImport = (rows: any[]) => {
    const newCourses: Course[] = [];
    const newTeachers: Teacher[] = [];
    const newStudents: Student[] = [];
    let courseIdCounter = courses.length + 1;
    let teacherIdCounter = teachers.length + 1;
    let studentIdCounter = students.length + 1;

    // Map for quick lookup
    const teacherMap: Record<string, Teacher> = {};
    const courseMap: Record<string, Course> = {};
    const studentMap: Record<string, Student> = {};

    teachers.forEach(t => { teacherMap[`${t.lastName} ${t.firstName}`] = t; });
    courses.forEach(c => { courseMap[`${c.name}_${c.semester}_${c.year}_${c.teacher.lastName} ${c.teacher.firstName}`] = c; });
    students.forEach(s => { studentMap[`${s.lastName} ${s.firstName} ${s.group}`] = s; });

    rows.forEach(row => {
      // Teacher
      let teacherKey = row['Викладач'];
      let teacher = teacherMap[teacherKey];
      if (!teacher && row['Викладач']) {
        teacher = {
          id: String(teacherIdCounter++),
          firstName: row['Викладач'].split(' ')[1] || '',
          lastName: row['Викладач'].split(' ')[0] || '',
          department: row['Кафедра'] || ''
        };
        teacherMap[teacherKey] = teacher;
        newTeachers.push(teacher);
      }
      // Course
      let courseKey = `${row['Назва курсу']}_${row['Семестр']}_${row['Рік']}_${row['Викладач']}`;
      let course = courseMap[courseKey];
      if (!course && row['Назва курсу']) {
        course = {
          id: String(courseIdCounter++),
          name: row['Назва курсу'],
          teacher: teacher!,
          semester: Number(row['Семестр']) || 1,
          year: Number(row['Рік']) || 2024
        };
        courseMap[courseKey] = course;
        newCourses.push(course);
      }
      // Student
      let studentKey = `${row['Прізвище']} ${row['Ім\'я']} ${row['Група']}`;
      let student = studentMap[studentKey];
      if (!student && row['Ім\'я'] && row['Прізвище']) {
        student = {
          id: String(studentIdCounter++),
          firstName: row['Ім\'я'],
          lastName: row['Прізвище'],
          group: row['Група'],
          grades: []
        };
        studentMap[studentKey] = student;
        newStudents.push(student);
      }
      // Grades
      if (student && course) {
        // Лекції
        if (row['Лекції'] !== undefined && row['Лекції'] !== '') {
          const existsLecture = student.grades.some(g => g.courseId === course.id && g.type === 'lecture');
          if (!existsLecture) {
            student.grades.push({
              id: `${student.id}_${course.id}_lecture`,
              studentId: student.id,
              courseId: course.id,
              type: 'lecture',
              value: Number(row['Лекції']),
              date: new Date().toISOString().split('T')[0]
            });
          }
        }
        // Практики
        if (row['Практики'] !== undefined && row['Практики'] !== '') {
          const existsPractice = student.grades.some(g => g.courseId === course.id && g.type === 'practice');
          if (!existsPractice) {
            student.grades.push({
              id: `${student.id}_${course.id}_practice`,
              studentId: student.id,
              courseId: course.id,
              type: 'practice',
              value: Number(row['Практики']),
              date: new Date().toISOString().split('T')[0]
            });
          }
        }
      }
    });
    setTeachers(prev => {
      const existing = new Set(prev.map(t => `${t.lastName} ${t.firstName}`));
      return [...prev, ...newTeachers.filter(t => !existing.has(`${t.lastName} ${t.firstName}`))];
    });
    setCourses(prev => {
      const existing = new Set(prev.map(c => `${c.name}_${c.semester}_${c.year}_${c.teacher.lastName} ${c.teacher.firstName}`));
      return [...prev, ...newCourses.filter(c => !existing.has(`${c.name}_${c.semester}_${c.year}_${c.teacher.lastName} ${c.teacher.firstName}`))];
    });
    setStudents(prev => {
      const updated = [...prev];
      newStudents.forEach(newS => {
        const idx = updated.findIndex(s => s.lastName === newS.lastName && s.firstName === newS.firstName && s.group === newS.group);
        if (idx === -1) {
          updated.push(newS);
        } else {
          // Додаємо лише нові оцінки
          newS.grades.forEach(newG => {
            const exists = updated[idx].grades.some(g => g.courseId === newG.courseId && g.type === newG.type);
            if (!exists) {
              updated[idx].grades.push(newG);
            }
          });
        }
      });
      return updated;
    });
  };

  // Оновлення оцінки
  const handleGradeEdit = (studentId: string, courseId: string, type: 'lecture' | 'practice', newValue: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        grades: s.grades.map(g =>
          g.courseId === courseId && g.type === type ? { ...g, value: newValue } : g
        )
      };
    }));
  };

  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-background-color">
          <Navigation />
          <main className="py-6">
            <div style={{ maxWidth: 400, margin: '0 auto 2rem auto' }}>
              <label htmlFor="student-select">Виберіть студента:</label>
              <select
                id="student-select"
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                style={{ marginLeft: 8 }}
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.lastName} {s.firstName} ({s.group})</option>
                ))}
              </select>
            </div>
            <Routes>
              <Route path="/" element={<StudentPortal student={students.find(s => s.id === selectedStudentId)!} courses={courses} />} />
              <Route path="/journal" element={<GradeJournal students={students} courses={courses} teachers={teachers} onGradeEdit={handleGradeEdit} />} />
              <Route path="/admin" element={<AdminPanel onUniversalImport={handleUniversalImport} />} />
            </Routes>
          </main>
          <ThemeToggle />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
