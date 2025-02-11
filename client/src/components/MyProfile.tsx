import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GithubIcon, LinkedinIcon, Globe, Edit2Icon, MessageCircle, UserPlus, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import WorkList from "@/components/WorkList";
import WorkModal from "@/components/WorkModal";

export default function MyProfile() {
  const [selectedTab, setSelectedTab] = useState("PROJECTS");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data, combining elements from original studentData
  const userData = {
    name: "Sajith Rajan",
    rollNo: "CB.EN.U4CSE21052",
    branch: "Computer Science",
    course: "B Tech",
    college: "Amrita Vishwa Vidhyapeetham",
    semester: "7",
    graduationYear: "2025",
    careerPath: "Software Engineer",
    followers: 128,
    following: 89,
    achievements: [
      { name: "Dean's List", year: "2024", icon: "🏆" },
      { name: "Best Project Award", year: "2023", icon: "🌟" },
      { name: "Technical Lead", year: "2024", icon: "👑" }
    ],
    socialLinks: {
      github: "https://github.com/sajithrajan",
      linkedin: "https://linkedin.com/in/sajithrajan",
      portfolio: "https://sajithrajan.dev",
    },
    skills: [
      { name: "React", level: 85, averagePeerLevel: 70 },
      { name: "Machine Learning", level: 75, averagePeerLevel: 65 },
      { name: "Data Science", level: 70, averagePeerLevel: 60 }
    ],
    academicProgress: {
      creditsCompleted: 140,
      totalCredits: 160,
      currentSemesterGrade: "A",
      attendance: 92
    }
  };

  // Work data, combining elements from original workData
  const data = {
    PROJECTS: [
      { id: 1, name: "Sony Project", description: "A web app built using React and Node.js", status: "Completed", level: "Medium", verified: "Verified", faculty: "Dr. Ritwik M" },
      { id: 2, name: "PiSave", description: "An Android app for task management", status: "Ongoing", level: "Easy", verified: "Unverified", faculty: "" },
      { id: 3, name: "Library Management", description: "A machine learning model for image classification", status: "Dropped", level: "Difficult", verified: "Unverified", faculty: "" },
    ],
    PAPERS: [
      { id: 1, title: "Research Paper A", status: "Published", verified: "Verified", faculty: "Prof. Anisha", journal: "IEEE Transactions", citations: 3 },
      { id: 2, title: "Research Paper B", status: "Ongoing", verified: "Unverified", faculty: "", journal: "", citations: 0 },
    ],
    EXTRACURRICULAR: [
      { id: 1, activity: "Hackathon", description: "Won first place in College Hackathon 2024", status: "Completed", date: "Jan 2024", achievement: "First Place" },
      { id: 2, activity: "Workshop", description: "Conducted ML Workshop for juniors", status: "Completed", date: "Feb 2024", achievement: "" },
    ],
  };

  const [workData, setWorkData] = useState(data);

  const handleAddItem = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const handleEditItem = (item: any) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleDeleteItem = (id: number) => {
    const newData = { ...workData };
    Object.keys(newData).forEach((key) => {
      newData[key] = newData[key].filter((item: any) => item.id !== id);
    });
    setWorkData(newData);
  };

  const handleSaveItem = (formData: any) => {
    const newData = { ...workData };
    const type = formData.type.toUpperCase() + "S";

    if (editItem) {
      newData[type] = newData[type].map((item: any) =>
        item.id === editItem.id ? { ...item, ...formData } : item
      );
    } else {
      const newId = Math.max(...newData[type].map((item: any) => item.id), 0) + 1;
      newData[type].push({ id: newId, ...formData });
    }

    setWorkData(newData);
    setShowModal(false);
    setEditItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Profile Header */}
          <div className="relative rounded-2xl bg-white shadow-sm border border-gray-100 p-8">
            <div className="absolute top-6 right-6 flex gap-3">
              <button
                className="px-4 py-2 rounded bg-blue-500 text-white"
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button className="px-4 py-2 border rounded">Message</button>
            </div>

            <div className="flex items-center gap-6">
              <img src="./defaultProfile.jpg" alt="Profile" className="h-24 w-24 rounded-full border-2 shadow-lg" />
              <div>
                <h1 className="text-4xl font-bold">{userData.name}</h1>
                <p className="text-gray-500">{userData.rollNo}</p>
                <p className="text-gray-500">{userData.branch}, {userData.course}</p>
                <p className="text-gray-500">{userData.college}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <a href={userData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="h-6 w-6" />
              </a>
              <a href={userData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="h-6 w-6 text-blue-600" />
              </a>
              <a href={userData.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                <Globe className="h-6 w-6 text-green-500" />
              </a>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold">Skills</h3>
              {userData.skills.map((skill:any, index) => (
                <div key={index} className="mt-2">
                  <p className="text-sm">{skill.name} - {skill.level}%</p>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </div>
             <div className="mt-4">
              <h3 className="text-xl font-semibold">Achievements</h3>
              {userData.achievements.map((achievement:any, index) => (
                <div key={index} className="mt-2">
                  <p className="text-sm">{achievement.name} ({achievement.year})</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Academic Progress</h3>
              <div>
                <p className="text-sm">Credits Progress: {userData.academicProgress.creditsCompleted}/{userData.academicProgress.totalCredits}</p>
                <Progress value={(userData.academicProgress.creditsCompleted / userData.academicProgress.totalCredits) * 100} className="h-2" />
                <p className="text-sm">Attendance: {userData.academicProgress.attendance}%</p>
                <Progress value={userData.academicProgress.attendance} className="h-2" />
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-8">
            <div className="flex gap-8 border-b border-gray-200">
              {["PROJECTS", "PAPERS", "EXTRACURRICULAR"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 ${selectedTab === tab ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Work Items Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mt-6"
            >
              <WorkList
                items={workData[selectedTab]}
                type={selectedTab.slice(0, -1)}
                onAdd={handleAddItem}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            </motion.div>
          </AnimatePresence>

          <WorkModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSaveItem} item={editItem} />
        </motion.div>
      </div>
    </div>
  );
}