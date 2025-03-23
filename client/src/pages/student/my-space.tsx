import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import ProjectCard from "@/components/my-space-components/ProjectCard";
import ProjectModal from "@/components/my-space-components/ProjectModal";
import ApplicantsModal from "@/components/ApplicantsModal";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
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

interface ProjectStats {
  totalApplicants: number;
  acceptedApplicants: number;
  completionPercentage: number;
}

interface Project {
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
  stats?: ProjectStats;
  team: {
    name: string;
    role: string;
  }[];
  tasks: {
    title: string;
    assignedTo: string;
    deadline: string;
    status: "Pending" | "Completed";
  }[];
  resources: {
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
    profileUrl?: string;
    skills?: string[];
  }[];
}

interface ProjectData {
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
}

export default function StudentMySpace() {
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
      isOpenForApplications: true,
      stats: {
        totalApplicants: 2,
        acceptedApplicants: 1,
        completionPercentage: 50,
      },
      team: [
        { name: "John Doe", role: "Team Member" },
        { name: "Jane Smith", role: "Team Member" },
      ],
      tasks: [
        { title: "Research", assignedTo: "John Doe", deadline: "2024-06-30", status: "Pending" },
        { title: "Data Analysis", assignedTo: "Jane Smith", deadline: "2024-06-15", status: "Completed" },
      ],
      resources: [
        { name: "AI Research Paper", type: "Document", url: "https://example.com/ai-research-paper.pdf" },
        { name: "AI Research Dataset", type: "Dataset", url: "https://example.com/ai-research-dataset.csv" },
      ],
      applicants: [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          status: "pending",
          appliedDate: "2024-03-15",
          experience: "2 years of ML experience, worked on NLP projects",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          status: "accepted",
          appliedDate: "2024-03-14",
          experience: "ML researcher, published papers in computer vision",
          notes: "Strong candidate with relevant research experience",
        },
      ],
    },
    {
      title: "Web Development",
      description: "Building a Student collaboration platform",
      tag: "Web",
      status: "Not Started",
      level: "Easy",
      duration: "2 months",
      mentor: "Prof. Johnson",
      prerequisites: "HTML, CSS, JS",
      techStack: "React, Node.js",
      skills: "Frontend Development, API Integration",
      maxTeamSize: "3",
      isOpenForApplications: true,
      stats: {
        totalApplicants: 0,
        acceptedApplicants: 0,
        completionPercentage: 0,
      },
      team: [],
      tasks: [],
      resources: [],
      applicants: [],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

  const handleViewApplicants = (projectTitle: string) => {
    const project = projects.find((p) => p.title === projectTitle);
    if (project) {
      setSelectedProject(project);
      setShowApplicantsModal(true);
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

  const handleUpdateApplicantStatus = (
    applicantId: string,
    newStatus: "pending" | "accepted" | "rejected" | "waitlisted",
  ) => {
    if (!selectedProject) return;

    setProjects(
      projects.map((project) => {
        if (project.title === selectedProject.title) {
          return {
            ...project,
            applicants: project.applicants.map((applicant) =>
              applicant.id === applicantId
                ? { ...applicant, status: newStatus }
                : applicant,
            ),
          };
        }
        return project;
      }),
    );
  };

  const handleAddApplicantNote = (applicantId: string, note: string) => {
    if (!selectedProject) return;

    setProjects(
      projects.map((project) => {
        if (project.title === selectedProject.title) {
          return {
            ...project,
            applicants: project.applicants.map((applicant) =>
              applicant.id === applicantId
                ? { ...applicant, notes: note }
                : applicant,
            ),
          };
        }
        return project;
      }),
    );
  };

  const handleSaveProject = async (data: ProjectData) => {
    try {
      const response = await fetch('http://localhost:8080/api/project/createProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: data.title,
          projectDescription: data.description,
          prerequisites: data.prerequisites,
          facultyMentorUsername: data.mentor,
          techStack: data.techStack,
          tags: data.tag,
          projectDurationMonths: parseInt(data.duration),
          projectLevel: data.level.toUpperCase(),
          projectStatus: data.status.toUpperCase().replace(' ', '_'),
          maxTeamSize: parseInt(data.maxTeamSize),
          projectRepo: '', // Optional field
          verificationFacultyUsername: data.mentor // Using mentor as verification faculty
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const result = await response.json();
      
      if (editingProject) {
        setProjects(
          projects.map((p) =>
            p.title === editingProject.title
              ? { ...p, ...data }
              : p,
          ),
        );
      } else {
        setProjects([
          ...projects,
          {
            ...data,
            team: [],
            tasks: [],
            resources: [],
            applicants: [],
          },
        ]);
      }
      setShowModal(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error creating project:', error);
      // You might want to show an error message to the user here
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isMobile = useIsMobile();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `/api/project/search?page=${page}&size=${pageSize}&searchTerm=${searchTerm}&status=${statusFilter}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [page, pageSize, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <StudentNavbar />
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">
              Student Projects
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
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                userType="student"
                onEdit={() => handleEditProject(project.title)}
                onDelete={() => handleDeleteConfirmation(project.title)}
                onViewApplicants={() => handleViewApplicants(project.title)}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-500 mt-8"
            >
              No projects found. Click "Add Project" to get started!
            </motion.div>
          )}
        </motion.div>

        {showModal && (
          <ProjectModal
            project={editingProject || undefined}
            onClose={() => {
              setShowModal(false);
              setEditingProject(null);
            }}
            onSave={handleSaveProject}
          />
        )}

        {showApplicantsModal && selectedProject && (
          <ApplicantsModal
            projectTitle={selectedProject.title}
            applicants={selectedProject.applicants}
            onClose={() => {
              setShowApplicantsModal(false);
              setSelectedProject(null);
            }}
            onUpdateStatus={handleUpdateApplicantStatus}
            onAddNote={handleAddApplicantNote}
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

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page + 1}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={projects.length < pageSize}
            >
              Next
            </Button>
          </div>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(0);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isMobile && <MobileBottomNav role="student" />}
    </div>
  );
}
