import type { Person, Project, Event, Resource } from '../types/search';

const mockResults = [
  {
    id: '1',
    type: 'person',
    title: 'John Doe',
    description: 'Machine Learning Researcher',
    department: 'CSE',
    role: 'Researcher',
    skills: ['Python', 'TensorFlow', 'Computer Vision'],
    tags: ['AI', 'Machine Learning'],
    timestamp: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  } as Person,
  {
    id: '2',
    type: 'project',
    title: 'AI-Powered Image Recognition',
    description: 'Advanced computer vision project',
    status: 'active',
    teamSize: 5,
    techStack: ['Python', 'TensorFlow', 'OpenCV'],
    tags: ['AI', 'Computer Vision'],
    timestamp: new Date().toISOString(),
    teamMembers: [
      {
        id: '1',
        name: 'John Doe',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ]
  } as Project,
  {
    id: '3',
    type: 'event',
    title: 'Machine Learning Workshop',
    description: 'Hands-on workshop on ML',
    date: '2024-03-15',
    location: 'Lab 401',
    organizer: 'AI Club',
    spotsLeft: 20,
    tags: ['Workshop', 'Machine Learning'],
    timestamp: new Date().toISOString()
  } as Event,
  {
    id: '4',
    type: 'resource',
    title: 'Introduction to Neural Networks',
    description: 'Comprehensive guide to neural networks',
    author: 'Dr. Smith',
    downloads: 234,
    rating: 4.5,
    format: 'PDF',
    level: 'beginner',
    tags: ['Neural Networks', 'AI'],
    timestamp: new Date().toISOString()
  } as Resource
];

export default mockResults;
