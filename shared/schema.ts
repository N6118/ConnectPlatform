import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tag: text("tag").notNull(),
  status: text("status").notNull(),
  level: text("level").notNull(),
  duration: text("duration").notNull(),
  mentor: text("mentor").notNull(),
  prerequisites: text("prerequisites").notNull(),
  techStack: text("techStack").array().notNull(),
  skills: text("skills").notNull(),
  maxTeamSize: integer("maxTeamSize").notNull(),
  imageUrl: text("imageUrl"),
  team: jsonb("team").notNull(),
  tasks: jsonb("tasks").notNull(),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const projectResources = pgTable("projectResources", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull(),
  name: text("name").notNull(),
  fileUrl: text("fileUrl").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const projectCollaborators = pgTable("projectCollaborators", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull(),
  userId: integer("userId").notNull(),
  lastActive: timestamp("lastActive").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResourceSchema = createInsertSchema(projectResources).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectResource = typeof projectResources.$inferSelect;
