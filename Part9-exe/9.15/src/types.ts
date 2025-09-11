export interface CoursePart {
  name: string;
  exerciseCount: number;
}

export interface HeaderProps {
  name: string;
}

export interface ContentProps {
  courseParts: CoursePart[];
}

export interface TotalProps {
  totalExercises: number;
}