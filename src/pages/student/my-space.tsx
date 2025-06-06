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
import { projectService, CreateProjectData } from "@/services/project";
import { Project as ApiProject } from "@/components/ui/project-card1";

interface ProjectStats {
  totalApplicants: number;
  acceptedApplicants: number;
  completionPercentage: number;
}

// Local Project interface that includes our specific fields
// while being compatible with some of the ApiProject fields
interface Project {
  id?: number;
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
  ownerId?: number;
  facultyMentorId?: number;
  verificationFacultyId?: number;
}

export default function StudentMySpace() {
  const [projects, setProjects] = useState<Project[]>([]);
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
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const isMobile = useIsMobile();

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
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://connectbeta-env-1.eba-ht35jqzk.eu-north-1.elasticbeanstalk.com/api/project/createProject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectName: data.title,
            projectDescription: data.description,
            ownerId: 1, // Default owner ID
            prerequisites: data.prerequisites,
            facultyMentor: 0, // Default mentor ID
            verificationFaculty: 0, // Default verification faculty ID
            techStack: data.techStack.split(",").map((tech) => tech.trim()),
            tags: data.tag.split(",").map((tag) => tag.trim()),
            projectDurationMonths: parseInt(data.duration),
            projectLevel: data.level.toUpperCase(),
            projectStatus: data.status.toUpperCase().replace(" ", "_"),
            projectRepo: "", // Optional field
            projectApplications: [],
            projectTeamMembers: [],
            projectVerifications: [],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const result = await response.json();

      if (editingProject) {
        setProjects(
          projects.map((p) =>
            p.title === editingProject.title ? { ...p, ...data } : p
          )
        );
      } else {
        // Refresh projects list
        fetchProjects();
      }
      setShowModal(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error creating project:", error);
      // You might want to show an error message to the user here
    }
  };

  // Convert API projects to the local Project format
  const mapApiProjectsToLocalFormat = (apiProjects: ApiProject[]): Project[] => {
    return apiProjects.map(apiProject => ({
      id: apiProject.id,
      title: apiProject.name,
      description: apiProject.description,
      tag: apiProject.tags.join(', '),
      status: apiProject.status === 'Ongoing' ? 'In Progress' : 'Completed',
      level: apiProject.projectLevel === 'EASY' ? 'Easy' : 
             apiProject.projectLevel === 'MEDIUM' ? 'Medium' : 'Difficult',
      duration: apiProject.projectDurationMonths?.toString() || '1',
      mentor: apiProject.mentor || '',
      prerequisites: apiProject.prerequisites?.join(', ') || '',
      techStack: apiProject.techStack.join(', '),
      skills: '',
      maxTeamSize: '4',
      isOpenForApplications: true,
      team: [],
      tasks: [],
      resources: [],
      applicants: []
    }));
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAllProjects();
      if (response.success && response.data) {
        const mappedProjects = mapApiProjectsToLocalFormat(response.data);
        setProjects(mappedProjects);
      } else {
        console.error('Failed to fetch projects:', response.error);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const searchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.searchProjects({
          searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          page,
        });
        
        if (response.success && response.data) {
          const mappedProjects = mapApiProjectsToLocalFormat(response.data);
          setProjects(mappedProjects);
        } else {
          console.error('Failed to search projects:', response.error);
        }
      } catch (error) {
        console.error('Error searching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm || statusFilter !== 'all') {
      searchProjects();
    }
  }, [page, pageSize, searchTerm, statusFilter]);

  const filteredProjects = projects;

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold">My Space</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Manage your projects, track applications, and collaborate with team members.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    setEditingProject(null);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative w-full max-w-md"
              >
                <img
                  src="/assets/myspace.png"
                  alt="My Space Illustration"
                  className="w-full h-auto rounded-lg "
                />
              </motion.div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
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
          </div>

          {loading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id?.toString() || project.title}
                    project={project}
                    userType="student"
                    onEdit={() => handleEditProject(project.title)}
                    onDelete={() => handleDeleteConfirmation(project.title)}
                    onViewApplicants={() => handleViewApplicants(project.title)}
                  />
                ))}
              </div>

              {filteredProjects.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-gray-500 mt-8"
                >
                  No projects found. Click "Add Project" to get started!
                </motion.div>
              )}
            </>
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
