CREATE TABLE "list_item" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"list" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "list_item_userId_idx" ON "list_item" USING btree ("user_id");