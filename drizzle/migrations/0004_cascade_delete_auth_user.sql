-- Drop FK on auth_user_id (added in earlier migration) since auth.users is in a different schema
-- and a trigger-based approach is cleaner for cross-schema cascade.
ALTER TABLE "res_users" DROP CONSTRAINT IF EXISTS "res_users_auth_user_id_res_users_id_fk";

-- Function + trigger: when an auth.users row is deleted, remove the corresponding res_users row.
CREATE OR REPLACE FUNCTION public.handle_auth_user_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.res_users WHERE auth_user_id = OLD.id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_delete();
