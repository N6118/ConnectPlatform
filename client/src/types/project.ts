export interface Project {
  title: string;
  description: string;
  tag: string;
  status: "Not Started" | "In Progress" | "Completed";
  level: "Easy" | "Medium" | "Difficult";
  duration: string;
  mentor: string;
  prerequisites: string;
  techStack: string | string[];
  skills: string;
  maxTeamSize: string | number;
  isOpenForApplications: boolean;
  imageUrl?: string;
  progress?: number;
  team?: { name: string; role: string }[];
  tasks?: {
    title: string;
    assignedTo: string;
    deadline: string;
    status: "Pending" | "Completed";
  }[];
  resources?: {
    name: string;
    type: string;
    url: string;
  }[];
  applicants: {
    id: string;
    name: string;
    email: string;
    status: "pending" | "accepted" | "rejected" | "waitlisted";
    appliedDate: string;
    experience: string;
    notes?: string;
  }[];
} 