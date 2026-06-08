CREATE TABLE "return_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"order_line_id" integer NOT NULL,
	"variant_id" integer,
	"user_id" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"reason" text,
	"status" "return_status" DEFAULT 'pending' NOT NULL,
	"refund_amount" numeric(12, 2) DEFAULT '0',
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
DROP TABLE "ir_audit_logs" CASCADE;--> statement-breakpoint
ALTER TABLE "order_lines" ADD COLUMN "cost_price" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "order_lines" ADD COLUMN "status" "line_status" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "channel" "order_channel" DEFAULT 'web';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paid_at" timestamp;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "fulfilled_at" timestamp;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "delivered_at" timestamp;--> statement-breakpoint
ALTER TABLE "product_template" ADD COLUMN "total_sold" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "total_sold" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_order_line_id_order_lines_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "public"."order_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "items";