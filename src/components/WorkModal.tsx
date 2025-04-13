import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ProjectModal from "@/components/my-space-components/ProjectModal";
import { projectService, CreateProjectData } from "@/services/project";

interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  item?: any;
}

interface ProjectData {
  title: string;
  description: string;
  prerequisites: string;
  mentor: string;
  tag: string;
  techStack: string;
  level: "Easy" | "Medium" | "Difficult";
  duration: string;
  status: "Not Started" | "In Progress" | "Completed";
  skills: string;
  maxTeamSize: string;
  isOpenForApplications: boolean;
}

const facultyOptions = [
  "Dr. Ritwik M",
  "Prof. Anisha",
  "Dr. Sarah Johnson",
  "Prof. Michael Lee",
];

export default function WorkModal({
  isOpen,
  onClose,
  onSave,
  item,
}: WorkModalProps) {
  const [workType, setWorkType] = useState<string>(item?.type || "Project");
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);

  useEffect(() => {
    // Set the work type when the item changes
    if (item) {
      setWorkType(item.type || "Project");
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    // If the type is Project, show the ProjectModal instead
    if (data.type === "Project") {
      setWorkType("Project");
      setShowProjectModal(true);
      return;
    }
    
    onSave(data);
  };

  const handleTypeChange = (value: string) => {
    setWorkType(value);
    
    // If changing to Project type, show the ProjectModal
    if (value === "Project") {
      setShowProjectModal(true);
    } else {
      setShowProjectModal(false);
    }
  };

  const handleProjectSave = async (projectData: ProjectData) => {
    try {
      // Convert the project data to the format expected by the API
      const createProjectData: CreateProjectData = {
        projectName: projectData.title,
        projectDescription: projectData.description,
        prerequisites: projectData.prerequisites,
        techStack: projectData.techStack.split(",").map((tech) => tech.trim()),
        tags: projectData.tag.split(",").map((tag) => tag.trim()),
        projectDurationMonths: parseInt(projectData.duration),
        projectStatus: projectData.status.toUpperCase().replace(" ", "_"),
        level: projectData.level.toUpperCase() as "EASY" | "MEDIUM" | "HARD",
        isOpenForApplications: projectData.isOpenForApplications,
      };

      // Call the project service to create the project
      const response = await projectService.createProject(createProjectData);
      
      if (response.success && response.data) {
        // Close the modal
        setShowProjectModal(false);
        onClose();
        
        // Pass the created project back to the parent component
        onSave({
          type: "Project",
          name: response.data.name,
          description: response.data.description,
          status: response.data.status,
          level: response.data.projectLevel,
          techStack: response.data.techStack,
          id: response.data.id,
        });
      } else {
        console.error("Failed to create project:", response.error);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // If showing the project modal, render it instead of the regular work modal
  if (showProjectModal) {
    return (
      <ProjectModal
        project={item ? {
          title: item.name || item.title || "",
          description: item.description || "",
          prerequisites: item.prerequisites || "",
          mentor: item.faculty || "",
          tag: Array.isArray(item.tags) ? item.tags.join(", ") : (item.tag || ""),
          techStack: Array.isArray(item.techStack) ? item.techStack.join(", ") : (item.techStack || ""),
          level: item.level || "Medium",
          duration: item.duration || "1",
          status: item.status === "Ongoing" ? "In Progress" : (item.status || "Not Started"),
          skills: item.skills || "",
          maxTeamSize: item.maxTeamSize || "4",
          isOpenForApplications: item.isOpenForApplications !== undefined ? item.isOpenForApplications : true,
        } : undefined}
        onClose={() => {
          setShowProjectModal(false);
          onClose();
        }}
        onSave={handleProjectSave}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select 
              name="type" 
              defaultValue={workType}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="Paper">Paper</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Extracurricular">Extracurricular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name/Title</Label>
            <Input
              id="name"
              name="name"
              defaultValue={item?.name || item?.title || ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={item?.description || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={item?.status || "Ongoing"}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Difficulty Level</Label>
            <Select name="level" defaultValue={item?.level || "Medium"}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Difficult">Difficult</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty</Label>
            <Select name="faculty" defaultValue={item?.faculty || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {facultyOptions.map((faculty) => (
                  <SelectItem key={faculty} value={faculty}>
                    {faculty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
