import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Book, Calendar, Code, Users, Activity, FileText, Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { statusColors, levelColors } from "@/components/ProjectCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

export default function ProjectDetails({ params }: { params: { title: string } }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newMember, setNewMember] = useState<TeamMember>({ name: "", role: "" });
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    assignedTo: "",
    deadline: "",
    status: "Pending"
  });

  // Mock project data with team and tasks
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
      },
      {
        title: "Initial Project Planning",
        assignedTo: "Jane Smith",
        deadline: "2024-04-15",
        status: "Pending"
      }
    ]
  });

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      setProject(prev => ({
        ...prev,
        team: [...prev.team, newMember]
      }));
      setNewMember({ name: "", role: "" });
      setShowAddMember(false);
    }
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.assignedTo && newTask.deadline) {
      setProject(prev => ({
        ...prev,
        tasks: [...prev.tasks, newTask]
      }));
      setNewTask({
        title: "",
        assignedTo: "",
        deadline: "",
        status: "Pending"
      });
      setShowAddTask(false);
    }
  };

  const handleTaskStatusChange = (taskTitle: string) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.title === taskTitle
          ? { ...task, status: task.status === "Pending" ? "Completed" : "Pending" }
          : task
      )
    }));
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link href="/my-space" className="flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2" size={20} />
          Back to Projects
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{project.title}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge className={statusColors[project.status]}>{project.status}</Badge>
              <Badge className={levelColors[project.level]}>{project.level}</Badge>
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
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={newMember.role}
                    onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>
                <Button onClick={handleAddMember}>Add Member</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
                  <h2 className="text-2xl font-semibold mb-2">Project Description</h2>
                  {isEditing ? (
                    <Textarea
                      value={project.description}
                      onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                      className="mb-4"
                    />
                  ) : (
                    <p className="text-muted-foreground">{project.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Book className="text-muted-foreground" size={20} />
                    <span className="text-muted-foreground">Mentor: {project.mentor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-muted-foreground" size={20} />
                    <span className="text-muted-foreground">Duration: {project.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-muted-foreground" size={20} />
                    <span className="text-muted-foreground">Team Size: {project.team.length} / {project.maxTeamSize}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="text-muted-foreground" size={20} />
                    <span className="text-muted-foreground">Tech Stack: {project.techStack.join(", ")}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
                <Edit2 className="h-4 w-4 mr-2" />
                {isEditing ? "Save" : "Edit"}
              </Button>
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
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="assignedTo">Assigned To</Label>
                      <Input
                        id="assignedTo"
                        value={newTask.assignedTo}
                        onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
                      />
                    </div>
                    <Button onClick={handleAddTask}>Add Task</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              {project.tasks.map((task, index) => (
                <div key={index} className="bg-card p-4 rounded-lg border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">Assigned to: {task.assignedTo}</p>
                    <p className="text-sm text-muted-foreground">Deadline: {task.deadline}</p>
                  </div>
                  <Badge
                    className={task.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
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
              <Button>
                <Plus className="mr-2" size={16} />
                Add Resource
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2" size={20} />
                Project Documentation
              </Button>
              <Button variant="outline" className="justify-start">
                <Code className="mr-2" size={20} />
                GitHub Repository
              </Button>
              <Button variant="outline" className="justify-start">
                <Book className="mr-2" size={20} />
                Learning Materials
              </Button>
              <Button variant="outline" className="justify-start">
                <Activity className="mr-2" size={20} />
                Progress Tracker
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}