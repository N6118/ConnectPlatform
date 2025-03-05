import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ui/project-card1";
import { ProjectFilters } from "@/components/ui/project-filters";
import { ProjectModal } from "@/components/ui/project-modal";
import StudentNavbar from "@/components/navigation/StudentNavbar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Project, User, ProjectTeamMember, ProjectApplication } from "@/components/ui/project-card1";

interface ApiResponse {
  data: ApiProject[];
  message: string;
  status: number;
  success: string;
  count: number;
}

interface ApiProject {
  id: number;
  projectName: string;
  projectDescription: string;
  projectStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  tags: string;
  projectImage: string;
  techStack: string;
  prerequisites: string;
  projectTeamMembers: ProjectTeamMember[];
  facultyMentor: User;
  projectRepo?: string;
  projectLevel?: 'EASY' | 'MEDIUM' | 'HARD';
  projectDurationMonths?: number;
  projectApplications?: ProjectApplication[];
  verificationFaculty?: User;
}

const transformApiProject = (apiProject: ApiProject): Project => {
  return {
    id: apiProject.id,
    name: apiProject.projectName,
    description: apiProject.projectDescription,
    status: apiProject.projectStatus === 'COMPLETED' ? 'Completed' : 'Ongoing',
    tags: apiProject.tags?.split(',').map((tag: string) => tag.trim()) || [],
    image: apiProject.projectImage || '/default-project-image.jpg',
    about: apiProject.projectDescription,
    techStack: apiProject.techStack?.split(',').map((tech: string) => tech.trim()) || [],
    prerequisites: apiProject.prerequisites?.split(',').map((prereq: string) => prereq.trim()) || [],
    members: apiProject.projectTeamMembers?.map((member: ProjectTeamMember) => 
      `${member.user.firstName} ${member.user.lastName}`
    ) || [],
    mentor: apiProject.facultyMentor ? 
      `${apiProject.facultyMentor.firstName} ${apiProject.facultyMentor.lastName}` : 
      'Unassigned',
    projectRepo: apiProject.projectRepo,
    projectLevel: apiProject.projectLevel,
    projectDurationMonths: apiProject.projectDurationMonths
  };
};

export default function StudentProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/project/getAllProjects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data: ApiResponse = await response.json();
      const transformedProjects = data.data.map(transformApiProject);
      setFilteredProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const allTags = Array.from(
    new Set(filteredProjects.flatMap((project) => project.tags))
  );

  const handleSearch = useCallback(() => {
    if (!filteredProjects) return;
    
    const filtered = filteredProjects.filter((project) => {
      const nameMatch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
      const tagMatch = selectedTags.length === 0 || 
        project.tags.some((tag) => selectedTags.includes(tag));
      const statusMatch = statusFilter === "All" || project.status === statusFilter;
      
      return nameMatch && tagMatch && statusMatch;
    });
    
    setFilteredProjects(filtered);
  }, [searchTerm, selectedTags, statusFilter, filteredProjects]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedTags, statusFilter, handleSearch]);

  const toggleTag = (tag: string) => {
    setSelectedTags((tags) =>
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    );
  };

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <StudentNavbar />
      <div className="container mx-auto p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">Projects</h1>
            <p className="text-xl text-muted-foreground">
              Discover and collaborate on exciting projects
            </p>
          </div>
        </motion.div>

        <ProjectFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          selectedTags={selectedTags}
          onTagToggle={toggleTag}
          allTags={allTags}
        />

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-muted-foreground">
              No projects found matching your criteria
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={openModal}
              />
            ))}
          </motion.div>
        )}
      </div>

      {isModalOpen && selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isMobile && <MobileBottomNav role="student" />}
    </div>
  );
}
