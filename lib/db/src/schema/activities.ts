import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  type: text("type").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  contentJson: text("content_json").notNull(),
});

export const insertActivitySchema = createInsertSchema(activitiesTable).omit({ id: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activitiesTable.$inferSelect;
