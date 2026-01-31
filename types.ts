export type ResourceType = 'YOUTUBE' | 'PDF' | 'TEXT' | 'AUDIO';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  status: 'new' | 'learning' | 'mastered';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}

export interface SummarySection {
  title: string;
  content: string; // Markdown
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  originalContent: string; // The full text or transcript
  summary: string; // Markdown summary
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  createdAt: number;
  lastAccessed: number;
  status: 'processing' | 'ready' | 'error';
  tags: string[];
}

export interface UserStats {
  streak: number;
  cardsLearned: number;
  quizScoreAvg: number;
  hoursLearned: number;
}