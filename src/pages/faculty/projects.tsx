import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ui/project-card1";
import { ProjectFilters } from "@/components/ui/project-filters";
import { ProjectModal } from "@/components/ui/project-modal";
import FacultyNavbar from "@/components/navigation/FacultyNavbar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Project } from "@/components/ui/project-card1";

const projects: Project[] = [
  {
    id: 1,
    name: "AI Chatbot",
    description: "A chatbot that uses AI to answer questions.",
    status: "Ongoing",
    tags: ["AI/ML", "Chatbot"],
    image:
      "https://t4.ftcdn.net/jpg/05/47/89/79/240_F_547897906_xOyy9X2M0VuInOpsnMOjcirgyoU9T8aJ.jpg",
    about:
      "An AI-driven platform to optimize full stack development processes.",
    techStack: ["Python", "TensorFlow", "React"],
    prerequisites: [
      "Programming Knowledge",
      "Machine Learning Fundamentals",
      "Frontend Development",
    ],
    members: ["Member 1", "Member 2"],
    mentor: "Dr. Alan Smith",
  },
  {
    id: 2,
    name: "Student Portal",
    description: "A comprehensive student management system.",
    status: "Completed",
    tags: ["Web", "Education"],
    image:
      "https://t4.ftcdn.net/jpg/10/65/59/79/240_F_1065597949_NyyaOdpLm8cPwRUJCNbAxYTF28I7YZWz.jpg",
    about: "A modern student portal for managing academic activities.",
    techStack: ["React", "Node.js", "PostgreSQL"],
    prerequisites: ["Web Development", "Database Design"],
    members: ["Member 3", "Member 4"],
    mentor: "Prof. Sarah Johnson",
  },
  {
    id: 3,
    name: "Blockchain Voting System",
    description: "A decentralized voting system to ensure transparency.",
    status: "Ongoing",
    tags: ["Blockchain", "Security"],
    image:
      "https://t4.ftcdn.net/jpg/02/80/23/05/240_F_280230556_JAkW4REfJhMvcwSvcn3IaaRHWtieFVwP.jpg",
    about: "A tamper-proof voting system built on blockchain technology.",
    techStack: ["Ethereum", "Solidity", "React"],
    prerequisites: ["Blockchain Basics", "Smart Contracts"],
    members: ["Member 5", "Member 6"],
    mentor: "Dr. David Lee",
  },
  {
    id: 4,
    name: "E-commerce App",
    description:
      "A fully functional e-commerce platform with payment integration.",
    status: "Completed",
    tags: ["E-commerce", "FullStack"],
    image:
      "https://t3.ftcdn.net/jpg/05/26/53/52/240_F_526535232_3FG0tckX1I3yAaHqqBeCdt0MVE1A5UQ2.jpg",
    about: "An online shopping platform with advanced recommendation systems.",
    techStack: ["React", "Node.js", "MongoDB"],
    prerequisites: ["Full Stack Development", "Payment Gateways"],
    members: ["Member 7", "Member 8"],
    mentor: "Prof. Emily Brown",
  },
  {
    id: 5,
    name: "IoT Smart Home System",
    description: "A home automation system using IoT devices.",
    status: "Ongoing",
    tags: ["IoT", "Automation"],
    image:
      "https://t3.ftcdn.net/jpg/04/83/54/58/240_F_483545852_zDFWGrmcZeJr0Mo3OmP6fYNVsMBsgdYc.jpg",
    about: "An IoT-based home automation system with remote control features.",
    techStack: ["Arduino", "Raspberry Pi", "Python"],
    prerequisites: ["Electronics Basics", "Embedded Systems"],
    members: ["Member 9", "Member 10"],
    mentor: "Dr. Michael Davis",
  },
  {
    id: 6,
    name: "AI-powered Resume Screener",
    description: "An AI tool that filters resumes for HR recruiters.",
    status: "Ongoing",
    tags: ["AI", "HRTech"],
    image:
      "https://t3.ftcdn.net/jpg/09/24/87/36/240_F_924873617_HFdKWiluMvMGSVFZTBxKMP0J2R4LXN0t.jpg",
    about: "A tool that ranks resumes based on relevance using NLP.",
    techStack: ["Python", "NLP", "Flask"],
    prerequisites: ["Natural Language Processing", "AI Basics"],
    members: ["Member 11", "Member 12"],
    mentor: "Prof. Jessica Wilson",
  },
  {
    id: 7,
    name: "Mental Health Chatbot",
    description: "A chatbot to provide mental health support and resources.",
    status: "Completed",
    tags: ["AI", "Healthcare"],
    image:
      "https://t3.ftcdn.net/jpg/10/09/17/74/240_F_1009177410_LDKeGJpok51Ulrpfn0HxJG4z4fVBwhGB.jpg",
    about: "A conversational AI model trained for mental health assistance.",
    techStack: ["Python", "Transformers", "React"],
    prerequisites: ["Machine Learning", "Sentiment Analysis"],
    members: ["Member 13", "Member 14"],
    mentor: "Dr. Kevin Garcia",
  },
  {
    id: 8,
    name: "Cloud-based File Storage",
    description: "A cloud storage solution for secure document management.",
    status: "Completed",
    tags: ["Cloud", "Security"],
    image:
      "https://t3.ftcdn.net/jpg/05/14/95/12/240_F_514951224_2dxMLbIw5qNRdPGD003chpbVcxWtcp7K.jpg",
    about: "A file storage platform with encryption for enhanced security.",
    techStack: ["AWS", "Node.js", "React"],
    prerequisites: ["Cloud Services", "Cybersecurity"],
    members: ["Member 15", "Member 16"],
    mentor: "Prof. Ashley Rodriguez",
  },
  {
    id: 9,
    name: "AI-powered News Aggregator",
    description: "A news app that summarizes articles using NLP.",
    status: "Ongoing",
    tags: ["AI", "NLP"],
    image:
      "https://t3.ftcdn.net/jpg/10/70/02/08/240_F_1070020887_sKWlo0mOUCuwhwTUo09QQH2xPyEUTlU4.jpg",
    about: "An AI-powered app that provides summarized news content.",
    techStack: ["Python", "NLP", "React"],
    prerequisites: ["Machine Learning", "Text Processing"],
    members: ["Member 17", "Member 18"],
    mentor: "Dr. Brian Martinez",
  },
  {
    id: 10,
    name: "Fitness Tracking App",
    description: "A fitness tracking mobile application with AI coaching.",
    status: "Ongoing",
    tags: ["Health", "AI"],
    image: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=800",
    about: "An AI-driven app that helps users track workouts and nutrition.",
    techStack: ["React Native", "Firebase", "AI"],
    prerequisites: ["Mobile App Development", "AI Basics"],
    members: ["Member 19", "Member 20"],
    mentor: "Prof. Christina Perez",
  },
];

export default function FacultyProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags)),
  );

  const handleSearch = useCallback(() => {
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedTags.length === 0 ||
          project.tags.some((tag) => selectedTags.includes(tag))) &&
        (statusFilter === "All" || project.status === statusFilter),
    );
    setFilteredProjects(filtered);
  }, [searchTerm, selectedTags, statusFilter]);

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
    <div className="min-h-screen bg-background">
      <FacultyNavbar />
      <div className="container mx-auto p-6 md:p-8 space-y-8">
        {isMobile && <MobileBottomNav role="faculty" />}
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

        {filteredProjects.length === 0 ? (
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
    </div>
  );
}
