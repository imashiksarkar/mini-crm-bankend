DROP INDEX "client_text_search_idx";--> statement-breakpoint
DROP INDEX "project_title_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "user_client_unique_idx" ON "clients" USING btree ("user_id","email");