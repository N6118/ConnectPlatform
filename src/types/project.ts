export interface Project {
  id: number;
  title: string;
  description: string;
  tag: string;
  status: "Not Started" | "In Progress" | "Completed";
  level: "Easy" | "Medium" | "Difficult";
  duration: string;
  mentor: string;
  prerequisites: string;
  techStack: string;
  skills: string;
  maxTeamSize: string;
  isOpenForApplications: boolean;
  imageUrl?: string;
  team: TeamMember[];
  tasks: Task[];
  resources: Resource[];
  applicants?: ProjectApplication[];
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface Task {
  title: string;
  assignedTo: string;
  deadline: string;
  status: "Pending" | "Completed";
}

export interface Resource {
  name: string;
  type: string;
  url: string;
}

export interface ProjectApplication {
  id: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "rejected" | "waitlisted";
  appliedDate: string;
  experience: string;
  notes?: string;
} 