export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  price: number;
  chapters: Chapter[];
  stats: {
    students: number;
    lessons: number;
    quizzes: number;
  };
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown
  videoUrl?: string;
  duration: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}
