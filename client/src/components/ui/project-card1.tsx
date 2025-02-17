import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'Ongoing' | 'Completed';
  tags: string[];
  image: string;
  about: string;
  techStack: string[];
  prerequisites: string[];
  members: string[];
  mentor: string;
}

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card 
      onClick={() => onClick(project)}
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge 
            variant={project.status === "Ongoing" ? "default" : "secondary"}
            className="absolute top-4 right-4"
          >
            {project.status}
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
          variant={project.status === "Ongoing" ? "default" : "secondary"} 
          className="w-full"
        >
          {project.status === "Ongoing" ? "Apply Now" : "View Details"}
        </Button>
      </CardFooter>
    </Card>
  );
}
