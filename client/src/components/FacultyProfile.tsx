import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { 
  FaEdit, 
  FaGraduationCap, 
  FaBook, 
  FaAward,
  FaGithub,
  FaLinkedin 
} from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FacultyProfileProps {
  faculty: {
    name: string;
    department: string;
    designation: string;
    expertise: string[];
    education: string[];
    publications: number;
    awards: string[];
    projects: number;
    email: string;
    phone: string;
    office: string;
    profileImage?: string;
    about?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    posts?: {
      id: number;
      title: string;
      content: string;
      date: string;
    }[];
  };
}

const FacultyProfile: React.FC<FacultyProfileProps> = ({ faculty }) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditLinksOpen, setIsEditLinksOpen] = useState(false);
  const [isEditAboutOpen, setIsEditAboutOpen] = useState(false);
  const [editedFaculty, setEditedFaculty] = useState(faculty);

  const handleSaveProfile = () => {
    // TODO: Implement save functionality
    setIsEditProfileOpen(false);
  };

  const handleSaveLinks = () => {
    // TODO: Implement save functionality
    setIsEditLinksOpen(false);
  };

  const handleSaveAbout = () => {
    // TODO: Implement save functionality
    setIsEditAboutOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Header */}
            <div className="md:w-1/3">
              <div className="relative">
                <Avatar className="w-48 h-48 mx-auto">
                  <img
                    src={faculty.profileImage || '/default-faculty.png'}
                    alt={faculty.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-2 right-2 rounded-full"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <FaEdit className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center mt-4">
                <h1 className="text-2xl font-bold">{faculty.name}</h1>
                <p className="text-gray-600">{faculty.designation}</p>
                <p className="text-gray-500">{faculty.department}</p>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    {faculty.githubUrl && (
                      <a href={faculty.githubUrl} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                      </a>
                    )}
                    {faculty.linkedinUrl && (
                      <a href={faculty.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="w-6 h-6 text-blue-600 hover:text-blue-800" />
                      </a>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditLinksOpen(true)}
                  >
                    <FaEdit className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">📧 {faculty.email}</p>
                <p className="text-sm text-gray-600">📱 {faculty.phone}</p>
                <p className="text-sm text-gray-600">🏢 {faculty.office}</p>
              </div>
            </div>

            {/* About Section */}
            <div className="md:w-2/3">
              <Card className="p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">About</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditAboutOpen(true)}
                  >
                    <FaEdit className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-600">{faculty.about || "No description available."}</p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaGraduationCap className="text-blue-500 w-5 h-5" />
                    <h2 className="text-lg font-semibold">Education</h2>
                  </div>
                  <ul className="space-y-2">
                    {faculty.education.map((edu, index) => (
                      <li key={index} className="text-gray-600">{edu}</li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaBook className="text-green-500 w-5 h-5" />
                    <h2 className="text-lg font-semibold">Expertise</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {faculty.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaAward className="text-yellow-500 w-5 h-5" />
                    <h2 className="text-lg font-semibold">Awards & Recognition</h2>
                  </div>
                  <ul className="space-y-2">
                    {faculty.awards.map((award, index) => (
                      <li key={index} className="text-gray-600">{award}</li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaBook className="text-purple-500 w-5 h-5" />
                    <h2 className="text-lg font-semibold">Publications & Projects</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{faculty.publications}</p>
                      <p className="text-gray-600">Publications</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{faculty.projects}</p>
                      <p className="text-gray-600">Projects Supervised</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Posts Section */}
              <Card className="p-4 mt-6">
                <h2 className="text-xl font-semibold mb-4">My Posts</h2>
                <div className="space-y-4">
                  {faculty.posts?.map((post) => (
                    <Card key={post.id} className="p-4">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-gray-500 text-sm">{post.date}</p>
                      <p className="text-gray-600 mt-2">{post.content}</p>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input type="file" accept="image/*" />
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Links Modal */}
      <Dialog open={isEditLinksOpen} onOpenChange={setIsEditLinksOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Social Links</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">GitHub URL</label>
              <Input
                value={editedFaculty.githubUrl}
                onChange={(e) => setEditedFaculty({...editedFaculty, githubUrl: e.target.value})}
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="text-sm font-medium">LinkedIn URL</label>
              <Input
                value={editedFaculty.linkedinUrl}
                onChange={(e) => setEditedFaculty({...editedFaculty, linkedinUrl: e.target.value})}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveLinks}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit About Modal */}
      <Dialog open={isEditAboutOpen} onOpenChange={setIsEditAboutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit About</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={editedFaculty.about}
              onChange={(e) => setEditedFaculty({...editedFaculty, about: e.target.value})}
              placeholder="Write something about yourself..."
              rows={6}
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveAbout}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacultyProfile;