ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role"[] USING "role"::text::"public"."user_role"[];--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT '{"user"}';