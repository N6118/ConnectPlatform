import type { z } from 'zod';

export interface User {
  username: string;
  password: string;
  role: "admin" | "faculty" | "student";
  name: string;
}

// Sample users for testing
export const sampleUsers: User[] = [
  {
    username: "admin@connect.edu",
    password: "Admin@123",
    role: "admin",
    name: "Admin User"
  },
  {
    username: "faculty@connect.edu",
    password: "Faculty@123",
    role: "faculty",
    name: "Faculty User"
  },
  {
    username: "student@connect.edu",
    password: "Student@123",
    role: "student",
    name: "Student User"
  }
];

// Mock authentication function - made async to simulate real API call
export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = sampleUsers.find(
    u => u.username === username && u.password === password
  );
  return user || null;
};