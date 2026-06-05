-- Migration 0008: Remaining table renames — res_/ir_ prefixes
-- All tables keep their existing columns and PKs

ALTER TABLE IF EXISTS "currencies" RENAME TO "res_currencies";
ALTER TABLE IF EXISTS "pages" RENAME TO "ir_pages";
ALTER TABLE IF EXISTS "menus" RENAME TO "ir_menus";
ALTER TABLE IF EXISTS "audit_logs" RENAME TO "ir_audit_logs";
