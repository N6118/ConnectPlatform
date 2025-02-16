import {
  users,
  type User,
  type InsertUser,
  projects,
  type Project,
  type InsertProject,
  clubs,
  type Club,
  type InsertClub,
  events,
  type Event,
  type InsertEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;

  // Club operations
  getClub(id: number): Promise<Club | undefined>;
  createClub(club: InsertClub): Promise<Club>;

  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  // Club operations
  async getClub(id: number): Promise<Club | undefined> {
    const [club] = await db
      .select()
      .from(clubs)
      .where(eq(clubs.id, id));
    return club;
  }

  async createClub(insertClub: InsertClub): Promise<Club> {
    const [club] = await db
      .insert(clubs)
      .values(insertClub)
      .returning();
    return club;
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, id));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }
}

export const storage = new DatabaseStorage();