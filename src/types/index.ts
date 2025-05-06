export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
}

export interface Course {
  id: string;
  name: string;
  teacher: Teacher;
  semester: number;
  year: number;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  type: 'lecture' | 'practice';
  value: number;
  date: string;
  comments?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  group: string;
  grades: Grade[];
} 