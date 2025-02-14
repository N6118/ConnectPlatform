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

export default function StudentProjectDetails({
  params,
}: {
  params: { title: string };
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
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

  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      status: "pending",
      appliedDate: "2024-03-20",
      experience: "3 years of web development experience",
    },
    {
      id: "2",
      name: "Emma Wilson",
      email: "emma@example.com",
      status: "pending",
      appliedDate: "2024-03-21",
      experience: "Recent graduate with strong ML background",
    },
  ]);

  const [project, setProject] = useState({
    title: decodeURIComponent(params.title),
    description: "This is a detailed description of the project.",
    status: "In Progress" as const,
    level: "Medium" as const,
    mentor: "Dr. Jane Smith",
    prerequisites: "Basic understanding of AI and Machine Learning",
    techStack: ["React", "Node.js", "TensorFlow"],
    duration: "3 months",
    maxTeamSize: 5,
    skills: "JavaScript, Python, Data Analysis",
    progress: 60,
    imageUrl:
      "https://media.istockphoto.com/id/1432955867/vector/technology-abstract-lines-and-dots-connect-background-with-hexagons-hexagon-grid-hexagons.jpg?s=612x612&w=0&k=20&c=gSMTHNjpqgpDU06e3G8GhQTUcqEcWfvafMFjzT3qzzQ=",
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
      {
        title: "Initial Project Planning",
        assignedTo: "Jane Smith",
        deadline: "2024-04-15",
        status: "Pending",
      },
    ],
    resources: [
      {
        name: "Project Documentation",
        type: "document",
        url: "/docs/project-doc.pdf",
      },
      {
        name: "GitHub Repository",
        type: "link",
        url: "https://github.com/project/repo",
      },
    ],
  });

  useEffect(() => {
    // Calculate progress based on completed tasks
    const completedTasks = project.tasks.filter(
      (task) => task.status === "Completed",
    ).length;
    const totalTasks = project.tasks.length;
    const newProgress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setProject((prev) => ({ ...prev, progress: newProgress }));
  }, [project.tasks]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProject((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      setProject((prev) => ({
        ...prev,
        team: [...prev.team, newMember],
      }));
      setNewMember({ name: "", role: "" });
      setShowAddMember(false);
    }
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.assignedTo && newTask.deadline) {
      setProject((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
      }));
      setNewTask({
        title: "",
        assignedTo: "",
        deadline: "",
        status: "Pending",
      });
      setShowAddTask(false);
    }
  };

  const handleAddResource = () => {
    if (newResource.name && newResource.type && newResource.url) {
      setProject((prev) => ({
        ...prev,
        resources: [...(prev.resources || []), newResource],
      }));
      setNewResource({ name: "", type: "", url: "" });
      setShowAddResource(false);
    }
  };

  const handleTaskStatusChange = (taskTitle: string) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.title === taskTitle
          ? {
              ...task,
              status: task.status === "Pending" ? "Completed" : "Pending",
            }
          : task,
      ),
    }));
  };

  const handleUpdateApplicantStatus = (
    applicantId: string,
    newStatus: Applicant["status"],
  ) => {
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === applicantId ? { ...app, status: newStatus } : app,
      ),
    );

    if (newStatus === "accepted") {
      const approvedApplicant = applicants.find(
        (app) => app.id === applicantId,
      );
      if (approvedApplicant) {
        setProject((prev) => ({
          ...prev,
          team: [
            ...prev.team,
            { name: approvedApplicant.name, role: "Team Member" },
          ],
        }));
      }
    }
  };

  const handleAddNote = (applicantId: string, note: string) => {
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === applicantId
          ? { ...app, notes: app.notes ? `${app.notes}\n${note}` : note }
          : app,
      ),
    );
  };

  return (
    <>
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
              <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
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
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
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
                    {isEditing ? (
                      <Textarea
                        value={project.description}
                        onChange={(e) =>
                          setProject((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="mb-4"
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditing ? (
                      <>
                        <div>
                          <Label>Mentor</Label>
                          <Input
                            value={project.mentor}
                            onChange={(e) =>
                              setProject((prev) => ({
                                ...prev,
                                mentor: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input
                            value={project.duration}
                            onChange={(e) =>
                              setProject((prev) => ({
                                ...prev,
                                duration: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Tech Stack</Label>
                          <Input
                            value={project.techStack.join(", ")}
                            onChange={(e) =>
                              setProject((prev) => ({
                                ...prev,
                                techStack: e.target.value
                                  .split(",")
                                  .map((s) => s.trim()),
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Max Team Size</Label>
                          <Input
                            type="number"
                            value={project.maxTeamSize}
                            onChange={(e) =>
                              setProject((prev) => ({
                                ...prev,
                                maxTeamSize: parseInt(e.target.value),
                              }))
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <>
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
                            Team Size: {project.team.length} /{" "}
                            {project.maxTeamSize}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Code className="text-muted-foreground" size={20} />
                          <span className="text-muted-foreground">
                            Tech Stack: {project.techStack.join(", ")}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">
                    {project.progress}%
                  </span>
                </div>
                <Progress value={project.progress} className="h-2" />
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
                <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
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
                  open={showAddResource}
                  onOpenChange={setShowAddResource}
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
          <TabsContent value="applicants">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <ApplicantsModal
                projectTitle={project.title}
                applicants={applicants}
                onClose={() => setActiveTab("overview")}
                onUpdateStatus={handleUpdateApplicantStatus}
                onAddNote={handleAddNote}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
