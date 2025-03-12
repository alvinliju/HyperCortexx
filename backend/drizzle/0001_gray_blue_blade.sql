CREATE TYPE "public"."language_type" AS ENUM('javascript', 'typescript', 'python', 'java', 'go', 'rust', 'c', 'cpp', 'csharp', 'php', 'ruby', 'html', 'css', 'sql', 'other');--> statement-breakpoint
ALTER TABLE "cortex" ADD COLUMN "language" "language_type";--> statement-breakpoint
ALTER TABLE "cortex" ADD COLUMN "content" text;