import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { projectService } from "@/services/project";

interface Project {
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
  projectRepo?: string;
  projectLevel?: 'EASY' | 'MEDIUM' | 'HARD';
  projectDurationMonths?: number;
  projectApplications?: ProjectApplication[];
  projectTeamMembers?: ProjectTeamMember[];
  verificationFaculty?: User;
  facultyMentor?: User;
}

interface ProjectApplication {
  id: number;
  student: User;
  applicationDate: string;
  status: 'APPLIED' | 'ACCEPTED' | 'REJECTED';
}

interface ProjectTeamMember {
  id: number;
  user: User;
  role: 'TEAM_MEMBER' | 'TEAM_LEADER';
}

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProjectApplication = async (projectId: number) => {
    try {
      setIsApplying(true);
      setError(null);
      
      const response = await projectService.applyToProject({
        projectId,
        userId: 1, // TODO: Get actual user ID from auth context or session
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to apply for project');
      }
      
      // Handle successful application
      onClose();
      // Could add a success toast/notification here
    } catch (error) {
      console.error('Error applying for project:', error);
      setError(error instanceof Error ? error.message : 'Failed to apply');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{project.about}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mentor</h3>
                  <p className="text-muted-foreground">{project.mentor}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>
                {project.projectLevel && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Difficulty Level</h3>
                    <Badge variant={
                      project.projectLevel === 'EASY' ? 'secondary' :
                      project.projectLevel === 'MEDIUM' ? 'outline' : 'destructive'
                    }>
                      {project.projectLevel}
                    </Badge>
                  </div>
                )}
                {project.projectDurationMonths && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Duration</h3>
                    <p className="text-muted-foreground">{project.projectDurationMonths} months</p>
                  </div>
                )}
                {project.projectRepo && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Repository</h3>
                    <a 
                      href={project.projectRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Repository
                    </a>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {project.prerequisites.map((prereq) => (
                      <li key={prereq}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {project.members.map((member) => (
                      <li key={member}>{member}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
              {project.status === 'Ongoing' ? (
                <Button
                  onClick={() => handleProjectApplication(project.id)}
                  disabled={isApplying}
                >
                  {isApplying ? "Applying..." : "Apply Now"}
                </Button>
              ) : (
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}