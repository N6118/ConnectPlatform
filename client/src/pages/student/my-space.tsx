import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, AlertTriangle } from "lucide-react";
import { useAuth } from "@/App";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import StudentNavbar from "@/components/navigation/StudentNavbar";

export interface Project {
  title: string;
  description: string;
  tag: string;
  status: "Not Started" | "In Progress" | "Completed";
  level: "Easy" | "Medium" | "Difficult";
  duration: string;
  mentor: string;
  prerequisites: string;
  techStack: string[];
  skills: string;
  maxTeamSize: number;
  imageUrl?: string;
  team: { name: string; role: string }[];
  tasks: {
    title: string;
    assignedTo: string;
    deadline: string;
    status: "Pending" | "Completed";
  }[];
  progress: number;
}

export default function StudentMySpace() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([
    {
      title: "AI Research Project",
      description: "Exploring applications of AI in education",
      tag: "AI",
      status: "In Progress",
      level: "Medium",
      duration: "3 months",
      mentor: "Dr. Smith",
      prerequisites: "Basic ML knowledge",
      techStack: ["Python", "TensorFlow"],
      skills: "Machine Learning, Data Analysis",
      maxTeamSize: 4,
      imageUrl: "/project-images/ai-research.jpg",
      team: [
        { name: "John Doe", role: "Team Lead" },
        { name: "Jane Smith", role: "Developer" },
      ],
      tasks: [
        {
          title: "Setup Development Environment",
          assignedTo: "John Doe",
          deadline: "2024-03-30",
          status: "Completed",
        },
      ],
      progress: 60,
    },
    {
      title: "Web Development",
      description: "Building a student collaboration platform",
      tag: "Web",
      status: "Not Started",
      level: "Easy",
      duration: "2 months",
      mentor: "Prof. Johnson",
      prerequisites: "HTML, CSS, JS",
      techStack: ["React", "Node.js"],
      skills: "Frontend Development, API Integration",
      maxTeamSize: 3,
      imageUrl: "/project-images/web-dev.jpg",
      team: [],
      tasks: [],
      progress: 0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    projectTitle: string;
  }>({ show: false, projectTitle: "" });

  const handleEditProject = (projectTitle: string) => {
    const project = projects.find((p) => p.title === projectTitle);
    if (project) {
      setEditingProject(project);
      setShowModal(true);
    }
  };

  const handleDeleteConfirmation = (projectTitle: string) => {
    setDeleteConfirmation({ show: true, projectTitle });
  };

  const handleDeleteProject = () => {
    setProjects(
      projects.filter((p) => p.title !== deleteConfirmation.projectTitle),
    );
    setDeleteConfirmation({ show: false, projectTitle: "" });
  };

  const handleSaveProject = (projectData: Project) => {
    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.title === editingProject.title
            ? {
                ...projectData,
                team: p.team,
                tasks: p.tasks,
                progress: p.progress,
              }
            : p,
        ),
      );
    } else {
      setProjects([
        ...projects,
        {
          ...projectData,
          team: [],
          tasks: [],
          progress: 0,
          imageUrl: "/project-images/default.jpg",
        },
      ]);
    }
    setShowModal(false);
    setEditingProject(null);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <StudentNavbar />

      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 md:mb-0">
              My Space
            </h1>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setShowModal(true)}
                className="w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
                onEdit={() => handleEditProject(project.title)}
                onDelete={() => handleDeleteConfirmation(project.title)}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-muted-foreground mt-8"
            >
              No projects found. Click "Add Project" to get started!
            </motion.div>
          )}
        </motion.div>

        {showModal && (
          <ProjectModal
            project={editingProject}
            onClose={() => {
              setShowModal(false);
              setEditingProject(null);
            }}
            onSave={handleSaveProject}
          />
        )}
        <AlertDialog
          open={deleteConfirmation.show}
          onOpenChange={(open) =>
            setDeleteConfirmation({
              show: open,
              projectTitle: deleteConfirmation.projectTitle,
            })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                project "{deleteConfirmation.projectTitle}" and remove all of
                its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject}>
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
