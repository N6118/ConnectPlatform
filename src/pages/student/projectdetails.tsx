import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Book,
  Calendar,
  Code,
  Users,
  Activity,
  FileText,
  Plus,
  Edit2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import {
  statusColors,
  levelColors,
} from "@/components/my-space-components/ProjectCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import StudentNavbar from "@/components/navigation/StudentNavbar";
import ApplicantsModal from "@/components/ApplicantsModal";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface TeamMember {
  name: string;
  role: string;
}

interface Task {
  title: string;
  assignedTo: string;
  deadline: string;
  status: "Pending" | "Completed";
}

interface Resource {
  name: string;
  type: string;
  url: string;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "rejected" | "waitlisted";
  appliedDate: string;
  experience: string;
  notes?: string;
}

interface Project {
  id: string | number;
  title: string;
  description: string;
  prerequisites: string;
  techStack: string[];
  tag: string;
  duration: string;
  level: "Easy" | "Medium" | "Difficult";
  status: "Not Started" | "In Progress" | "Completed";
  mentor: string;
  imageUrl: string;
  team: TeamMember[];
  tasks: Task[];
  resources: Resource[];
  applicants: Applicant[];
  isOpenForApplications: boolean;
  projectRepo: string;
}

export default function StudentProjectDetails({
  params,
}: {
  params: { id: string };
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<TeamMember>({
    name: "",
    role: "",
  });
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    assignedTo: "",
    deadline: "",
    status: "Pending",
  });
  const [newResource, setNewResource] = useState<Resource>({
    name: "",
    type: "",
    url: "",
  });
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [progress, setProgress] = useState(0);

  const isMobile = useIsMobile();
  const defaultImageUrl = "https://via.placeholder.com/600x400";

  useEffect(() => {
    async function fetchProject() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(`http://connectbeta-env-1.eba-ht35jqzk.eu-north-1.elasticbeanstalk.com/api/project/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }
        const result = await response.json();
        const fetchedProject = result.data;
        
        // Map the API response to our local project structure
        const mappedProject: Project = {
          id: fetchedProject.id,
          title: fetchedProject.projectName,
          description: fetchedProject.projectDescription,
          prerequisites: fetchedProject.prerequisites,
          techStack: fetchedProject.techStack || [],
          tag: (fetchedProject.tags || []).join(', '),
          duration: fetchedProject.projectDurationMonths.toString(),
          level: fetchedProject.projectLevel === "EASY" 
            ? "Easy" 
            : fetchedProject.projectLevel === "MEDIUM" 
            ? "Medium" 
            : "Difficult",
          status: fetchedProject.projectStatus === "NOT_STARTED"
            ? "Not Started"
            : fetchedProject.projectStatus === "IN_PROGRESS"
            ? "In Progress"
            : "Completed",
          mentor: fetchedProject.owner.name,
          imageUrl: fetchedProject.projectImage || defaultImageUrl,
          team: fetchedProject.projectTeamMembers || [],
          tasks: [],
          resources: [],
          applicants: [],
          isOpenForApplications: true,
          projectRepo: fetchedProject.projectRepo
        };
        setProject(mappedProject);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setError(error instanceof Error ? error.message : 'Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    }

    void fetchProject();
  }, [params.id]);

  useEffect(() => {
    if (!project) return;
    
    // Calculate progress based on completed tasks
    const completedTasks = project.tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const totalTasks = project.tasks.length;
    const newProgress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setProgress(newProgress);

  }, [project?.tasks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading project details...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error || 'Project not found'}</div>
      </div>
    );
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && project) {
      // Here you would typically upload the file to your server
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setProject({
        ...project,
        imageUrl,
      });
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (project && newMember.name) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        console.log('Token:', token); // Debug token value

        const response = await fetch('http://connectbeta-env-1.eba-ht35jqzk.eu-north-1.elasticbeanstalk.com/api/project/addMember', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, // Added back the Bearer prefix
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            projectId: project.id,
            userName: newMember.name,
            role: "TEAM_MEMBER"
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error response:', errorData);
          throw new Error(`Failed to add team member: ${errorData}`);
        }

        // Update local state only after successful API call
        setProject({
          ...project,
          team: [...project.team, newMember],
        });
        setNewMember({ name: "", role: "" });
        setIsEditDialogOpen(false);
      } catch (error) {
        console.error("Error adding team member:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (project && newTask.title && newTask.assignedTo && newTask.deadline) {
      setProject({
        ...project,
        tasks: [...project.tasks, newTask],
      });
      setNewTask({
        title: "",
        assignedTo: "",
        deadline: "",
        status: "Pending",
      });
      setIsAddTaskDialogOpen(false);
    }
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (project && newResource.name && newResource.type && newResource.url) {
      setProject({
        ...project,
        resources: [...project.resources, newResource],
      });
      setNewResource({ name: "", type: "", url: "" });
      setIsAddResourceDialogOpen(false);
    }
  };

  const handleTaskStatusChange = async (taskTitle: string) => {
    try {
      const response = await fetch(`/api/project/${project.id}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: taskTitle,
          status: project.tasks?.find(t => t.title === taskTitle)?.status === "Pending" 
            ? "Completed" 
            : "Pending"
        }),
      });

      if (response.ok) {
        setProject((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            tasks: prev.tasks?.map((task) =>
              task.title === taskTitle
                ? {
                    ...task,
                    status: task.status === "Pending" ? "Completed" : "Pending",
                  }
                : task
            ) || [],
          };
        });
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleUpdateApplicantStatus = (
    applicantId: string,
    newStatus: Applicant["status"]
  ) => {
    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) =>
        applicant.id === applicantId
          ? { ...applicant, status: newStatus }
          : applicant
      )
    );
  };

  const handleAddNote = (applicantId: string, note: string) => {
    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) =>
        applicant.id === applicantId
          ? { ...applicant, notes: note }
          : applicant
      )
    );
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <StudentNavbar />
      <div className="container mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/student/my-space"
            className="flex items-center text-primary hover:underline mb-6"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Projects
          </Link>

          {/* Project Header with Image */}
          <div className="mb-8">
            <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button variant="secondary" size="sm">
                    <Upload className="mr-2" size={16} />
                    Change Cover
                  </Button>
                </label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {project.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge className={statusColors[project.status]}>
                    {project.status}
                  </Badge>
                  <Badge className={levelColors[project.level]}>
                    {project.level}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog open={showApplicantsModal} onOpenChange={setShowApplicantsModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Users className="mr-2" size={16} />
                      View Applicants
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Project Applicants</DialogTitle>
                    </DialogHeader>
                    <ApplicantsModal
                      projectTitle={project.title}
                      applicants={applicants}
                      onClose={() => setShowApplicantsModal(false)}
                      onUpdateStatus={handleUpdateApplicantStatus}
                      onAddNote={handleAddNote}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2" size={16} />
                      Add Team Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newMember.name}
                          onChange={(e) =>
                            setNewMember((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={newMember.role}
                          onChange={(e) =>
                            setNewMember((prev) => ({
                              ...prev,
                              role: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <Button onClick={handleAddMember}>Add Member</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">
                      Project Description
                    </h2>
                    <p className="text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Book className="text-muted-foreground" size={20} />
                      <span className="text-muted-foreground">
                        Mentor: {project.mentor}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar
                        className="text-muted-foreground"
                        size={20}
                      />
                      <span className="text-muted-foreground">
                        Duration: {project.duration}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="text-muted-foreground" size={20} />
                      <span className="text-muted-foreground">
                        Team Size: {project.team.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="text-muted-foreground" size={20} />
                      <span className="text-muted-foreground">
                        Tech Stack: {project.techStack.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="team">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.team.map((member, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="progress">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold">Tasks & Progress</h2>
                <Dialog
                  open={isAddTaskDialogOpen}
                  onOpenChange={setIsAddTaskDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2" size={16} />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="taskTitle">Task Title</Label>
                        <Input
                          id="taskTitle"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="assignedTo">Assigned To</Label>
                        <Input
                          id="assignedTo"
                          value={newTask.assignedTo}
                          onChange={(e) =>
                            setNewTask((prev) => ({
                              ...prev,
                              assignedTo: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={newTask.deadline}
                          onChange={(e) =>
                            setNewTask((prev) => ({
                              ...prev,
                              deadline: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <Button onClick={handleAddTask}>Add Task</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-4">
                {project.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="bg-card p-4 rounded-lg border flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Assigned to: {task.assignedTo}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Deadline: {task.deadline}
                      </p>
                    </div>
                    <Badge
                      className={
                        task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                      onClick={() => handleTaskStatusChange(task.title)}
                      style={{ cursor: "pointer" }}
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="resources">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold">Project Resources</h2>
                <Dialog
                  open={isAddResourceDialogOpen}
                  onOpenChange={setIsAddResourceDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2" size={16} />
                      Add Resource
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Resource</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="resourceName">Resource Name</Label>
                        <Input
                          id="resourceName"
                          value={newResource.name}
                          onChange={(e) =>
                            setNewResource((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="resourceType">Resource Type</Label>
                        <Input
                          id="resourceType"
                          value={newResource.type}
                          onChange={(e) =>
                            setNewResource((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="resourceUrl">Resource URL</Label>
                        <Input
                          id="resourceUrl"
                          value={newResource.url}
                          onChange={(e) =>
                            setNewResource((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <Button onClick={handleAddResource}>Add Resource</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.resources?.map((resource, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start"
                    onClick={() => window.open(resource.url, "_blank")}
                  >
                    <FileText className="mr-2" size={20} />
                    {resource.name}
                  </Button>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      {isMobile && <MobileBottomNav role="student" />}
    </div>
  );
}
