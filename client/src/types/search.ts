export interface FilterOption {
  id: string;
  label: string;
  value: string;
  type: 'department' | 'year' | 'skill';
}

export interface SearchResult {
  id: string;
  type: 'person' | 'project' | 'event' | 'resource';
  title: string;
  description: string;
  tags: string[];
  timestamp: string;
  imageUrl?: string;
}

export interface Person extends SearchResult {
  type: 'person';
  department: string;
  role: 'faculty' | 'admin' | 'student' | 'researcher' | string;
  skills: string[];
}

export interface Project extends SearchResult {
  type: 'project';
  status: 'active' | 'completed' | 'on-hold';
  teamSize: number;
  techStack: string[];
  teamMembers: Array<{
    id: string;
    name: string;
    imageUrl: string;
  }>;
}

export interface Event extends SearchResult {
  type: 'event';
  date: string;
  location: string;
  organizer: string;
  spotsLeft: number;
}

export interface Resource extends SearchResult {
  type: 'resource';
  author: string;
  downloads: number;
  rating: number;
  format: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}
