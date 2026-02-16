export interface Flashcard {
  id: string;
  domain: string;
  topic: string;
  icon: string;
  awsIcon: string;
  question: string;
  answer?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  type: string;
  difficulty: string;
}

export interface CardProgress {
  id: string;
  correct: number;
  incorrect: number;
  lastReview: string | null;
  difficulty: number;
}

export interface Task {
  id: string;
  name: string;
  cards: Flashcard[];
}

export interface Domain {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  tasks: Task[];
}
