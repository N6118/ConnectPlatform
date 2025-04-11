export interface WorkItem {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  status: string;
  level?: string;
  verified?: string;
  faculty?: string;
  activity?: string;
  techStack?: string[];
  collaborators?: string[];
  achievement?: string;
  date?: string;
  citations?: number;
  journal?: string;
}

export interface WorkData {
  PROJECTS: WorkItem[];
  PAPERS: WorkItem[];
  INTERNSHIPS: WorkItem[];
  EXTRACURRICULAR: WorkItem[];
} 