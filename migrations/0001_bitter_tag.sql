DROP INDEX "client_name_idx";--> statement-breakpoint
DROP INDEX "client_email_idx";--> statement-breakpoint
CREATE INDEX "client_text_search_idx" ON "clients" USING btree ("name","email","phone");