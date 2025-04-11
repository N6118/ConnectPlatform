// This file contains mock API handlers to simulate the server functionality
// You can expand this with more mock data as needed

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  about: string;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
}

interface Achievement {
  title: string;
}

interface Interest {
  name: string;
}

interface WorkItem {
  id: string;
  title: string;
  description: string;
  user_id: string;
}

// Mock user data
const mockUsers: Record<string, User> = {
  '1': {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    about: 'Computer Science student interested in AI and machine learning',
    github_url: 'https://github.com/johndoe',
    linkedin_url: 'https://linkedin.com/in/johndoe',
    portfolio_url: 'https://johndoe.dev',
  },
  '2': {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'faculty',
    about: 'Professor of Computer Science with focus on distributed systems',
    github_url: 'https://github.com/janesmith',
    linkedin_url: 'https://linkedin.com/in/janesmith',
    portfolio_url: 'https://janesmith.dev',
  }
};

// Mock achievements
const mockAchievements: Record<string, Achievement[]> = {
  '1': [
    { title: 'Dean\'s List 2023' },
    { title: 'Hackathon Winner 2022' },
    { title: 'Outstanding Student Award' }
  ],
  '2': [
    { title: 'Best Teacher Award 2023' },
    { title: 'Research Excellence Award' },
    { title: 'Published in IEEE Journal' }
  ]
};

// Mock interests
const mockInterests: Record<string, Interest[]> = {
  '1': [
    { name: 'Artificial Intelligence' },
    { name: 'Web Development' },
    { name: 'Cybersecurity' }
  ],
  '2': [
    { name: 'Distributed Systems' },
    { name: 'Cloud Computing' },
    { name: 'Research Methodology' }
  ]
};

// Mock work items
const mockWorkItems: Record<string, WorkItem[]> = {
  '1': [
    { id: '101', title: 'AI Project', description: 'Developed a machine learning model', user_id: '1' },
    { id: '102', title: 'Web App', description: 'Created a React-based web application', user_id: '1' }
  ],
  '2': [
    { id: '201', title: 'Research Paper', description: 'Published a paper on distributed systems', user_id: '2' },
    { id: '202', title: 'Course Development', description: 'Created a new course on cloud computing', user_id: '2' }
  ]
};

interface ApiResponse {
  status: number;
  body: any;
}

export const handlers = {
  // GET profile handler
  getProfile: (userId: string): ApiResponse => {
    if (!mockUsers[userId]) {
      return { status: 404, body: { error: 'User not found' } };
    }

    return {
      status: 200,
      body: {
        ...mockUsers[userId],
        achievements: mockAchievements[userId]?.map((a: Achievement) => a.title) || [],
        interests: mockInterests[userId]?.map((i: Interest) => i.name) || [],
        workItems: mockWorkItems[userId] || []
      }
    };
  },

  // UPDATE profile handler
  updateProfile: (userId: string, data: any): ApiResponse => {
    if (!mockUsers[userId]) {
      return { status: 404, body: { error: 'User not found' } };
    }

    // In a real implementation, you would update the data here
    // For this mock, we'll just return a success message
    return {
      status: 200,
      body: { message: 'Profile updated successfully' }
    };
  }
};
