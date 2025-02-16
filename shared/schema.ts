import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
  uuid,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["admin", "faculty", "student"] }).notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status", {
    enum: ["active", "completed", "archived"],
  }).notNull(),
  mentorId: integer("mentorId")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Clubs table
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  banner: text("banner"),
  advisorId: integer("advisorId")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// Club memberships
export const clubMembers = pgTable("clubMembers", {
  id: serial("id").primaryKey(),
  clubId: integer("clubId")
    .notNull()
    .references(() => clubs.id),
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  role: text("role", { enum: ["member", "leader", "advisor"] }).notNull(),
  joinedAt: timestamp("joinedAt").notNull().defaultNow(),
});

// Activities and events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  clubId: integer("clubId").references(() => clubs.id),
  createdBy: integer("createdBy")
    .notNull()
    .references(() => users.id),
  type: text("type", { enum: ["club", "project", "academic"] }).notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  clubs: many(clubs),
  clubMemberships: many(clubMembers),
  events: many(events),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  mentor: one(users, {
    fields: [projects.mentorId],
    references: [users.id],
  }),
}));

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  advisor: one(users, {
    fields: [clubs.advisorId],
    references: [users.id],
  }),
  members: many(clubMembers),
  events: many(events),
}));

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Club = typeof clubs.$inferSelect;
export type InsertClub = z.infer<typeof insertClubSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

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
