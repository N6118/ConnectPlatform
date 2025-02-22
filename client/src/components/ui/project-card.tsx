import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import React from "react";

interface ProjectCardProps {
  project: Project;
  userType: 'faculty' | 'student';
  onEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onViewApplicants?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ProjectCard({ 
  project, 
  userType,
  onEdit,
  onDelete,
  onViewApplicants 
}: ProjectCardProps) {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.imageUrl || "/default-project-image.jpg"}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge 
            variant={project.status === "In Progress" ? "default" : "secondary"}
            className="absolute top-4 right-4"
          >
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-xl mb-2">{project.title}</h3>
        <p className="text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="outline">{project.tag}</Badge>
          <Badge variant="outline">{project.level}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default"
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
      {userType === 'faculty' && (
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(e);
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(e);
            }}
          >
            Delete
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewApplicants?.(e);
            }}
          >
            View Applicants
          </Button>
        </div>
      )}
    </Card>
  );
}
