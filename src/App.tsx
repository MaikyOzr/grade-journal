import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { StudentPortal } from './components/StudentPortal';
import { GradeJournal } from './components/GradeJournal';
import { ThemeToggle } from './components/ThemeToggle';
import type { Student, Course, Grade, Teacher } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader } from './components/Loader';

const mockStudent: Student = {
  id: '1',
  firstName: 'Іван',
  lastName: 'Петренко',
  group: 'КН-101',
  grades: [
    {
      id: '1',
      studentId: '1',
      courseId: '1',
      type: 'lecture' as const,
      value: 85,
      date: '2024-03-15'
    },
    {
      id: '2',
      studentId: '1',
      courseId: '1',
      type: 'practice' as const,
      value: 90,
      date: '2024-03-16'
    }
  ]
};

const mockCourses: Course[] = [
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

const mockTeachers: Teacher[] = [
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
              element={<StudentPortal student={mockStudent} courses={mockCourses} />} 
            />
            <Route 
              path="/journal" 
              element={<GradeJournal students={[mockStudent]} courses={mockCourses} teachers={mockTeachers} />} 
            />
          </Routes>
        </Suspense>
      </CSSTransition>
    </TransitionGroup>
  );
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-background-color">
          <Navigation />
          <main className="py-6">
            <AnimatedRoutes />
          </main>
          <ThemeToggle />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
