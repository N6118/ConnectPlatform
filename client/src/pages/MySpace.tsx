import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@/App";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Project {
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
  team?: { name: string; role: string }[];
  tasks?: {
    title: string;
    assignedTo: string;
    deadline: string;
    status: "Pending" | "Completed";
  }[];
  progress?: number;
}

export default function MySpace() {
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
      techStack: "Python, TensorFlow",
      skills: "Machine Learning, Data Analysis",
      maxTeamSize: "4",
      team: [
        { name: "John Doe", role: "Team Lead" },
        { name: "Jane Smith", role: "Developer" }
      ],
      tasks: [
        {
          title: "Setup Development Environment",
          assignedTo: "John Doe",
          deadline: "2024-03-30",
          status: "Completed"
        }
      ],
      progress: 60
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
      techStack: "React, Node.js",
      skills: "Frontend Development, API Integration",
      maxTeamSize: "3",
      team: [],
      tasks: [],
      progress: 0
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleEditProject = (projectTitle: string) => {
    const project = projects.find((p) => p.title === projectTitle);
    if (project) {
      setEditingProject(project);
      setShowModal(true);
    }
  };

  const handleDeleteProject = (projectTitle: string) => {
    setProjects(projects.filter((p) => p.title !== projectTitle));
  };

  const handleSaveProject = (projectData: Project) => {
    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.title === editingProject.title ? projectData : p,
        ),
      );
    } else {
      setProjects([...projects, {
        ...projectData,
        team: [],
        tasks: [],
        progress: 0
      }]);
    }
    setShowModal(false);
    setEditingProject(null);
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
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
              onDelete={() => handleDeleteProject(project.title)}
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

        <div className="bg-card p-6 rounded-lg shadow-sm mt-8 border">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}</h2>
          <p className="text-muted-foreground">
            This is your personal space where you can manage your projects and
            activities. Create, track, and collaborate on various academic and
            research initiatives.
          </p>
        </div>
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
    </div>
  );
}