import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface ProjectApplication {
  id: number;
  user: User;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
}

export interface ProjectTeamMember {
  id: number;
  user: User;
  role: string;
  joinedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  tags: string[];
  image: string;
  about: string;
  techStack: string[];
  prerequisites: string[];
  members: string[];
  mentor: string;
  projectRepo?: string;
  projectLevel?: 'EASY' | 'MEDIUM' | 'HARD';
  projectDurationMonths?: number;
}

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'default';
      case 'COMPLETED':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'NOT_STARTED':
        return 'Not Started';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <Card
      onClick={() => onClick(project)}
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageError ? '/default-project-image.jpg' : project.image}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge
            variant={getStatusVariant(project.status)}
            className="absolute top-4 right-4"
          >
            {getStatusText(project.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-xl mb-2">{project.name}</h3>
        <p className="text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={project.status === "IN_PROGRESS" ? "default" : "secondary"}
          className="w-full"
        >
          {project.status === "IN_PROGRESS" ? "Apply Now" : "View Details"}
        </Button>
      </CardFooter>
    </Card>
  );
}
