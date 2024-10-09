export interface Question {
  id: number;
  question: string;
  answer: string;
  question_code?: string;
  answer_code?: string;
  concept_id: number;
  question_type: 'technical' | 'general' | 'competency';
}

// ... other interfaces ...