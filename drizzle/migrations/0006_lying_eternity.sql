CREATE TABLE "ir_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"action" "audit_action" DEFAULT 'create' NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"details" jsonb DEFAULT '{}',
	"ip_address" text,
	"user_agent" text,
	"severity" "audit_severity" DEFAULT 'info' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
