import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getAuthorizedClinician() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  const authorizedEmail = process.env.CLINICIAN_EMAIL?.trim().toLowerCase();

  if (error || !user?.email || !authorizedEmail || user.email.toLowerCase() !== authorizedEmail) {
    return null;
  }

  return { user, admin: createAdminClient() };
}
