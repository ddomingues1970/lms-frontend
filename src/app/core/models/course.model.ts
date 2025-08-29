export interface Course {
  id: number;
  name: string;
  description: string;      // <-- novo
  startDate: string;        // 'YYYY-MM-DD'
  endDate: string;          // 'YYYY-MM-DD'
}

export interface CourseCreate {
  name: string;
  description: string;      // <-- novo
  startDate: string;
  endDate: string;
}

export interface CourseUpdate extends CourseCreate {}
