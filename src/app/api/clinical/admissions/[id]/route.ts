import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthorizedClinician } from "@/lib/clinical-auth";

const dischargeSchema = z.object({
  summary: z.string().trim().min(5).max(5000),
  medications: z.string().trim().max(3000).default(""),
  followUp: z.string().trim().max(3000).default(""),
  physicianName: z.string().trim().min(2).max(150),
});

export async function PATCH(request: Request, context: RouteContext<"/api/clinical/admissions/[id]">) {
  const clinician = await getAuthorizedClinician();
  if (!clinician) return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });

  const { id } = await context.params;
  const parsed = dischargeSchema.safeParse(await request.json().catch(() => null));
  if (!z.string().uuid().safeParse(id).success || !parsed.success) {
    return NextResponse.json({ error: "Confira os dados da alta." }, { status: 400 });
  }

  const { data: admission, error } = await clinician.admin.rpc("record_discharge", {
    p_admission_id: id,
    p_summary: parsed.data.summary,
    p_medications: parsed.data.medications,
    p_follow_up: parsed.data.followUp,
    p_physician_name: parsed.data.physicianName,
  });

  if (error || !admission) return NextResponse.json({ error: "Não foi possível registrar a alta." }, { status: 400 });

  const { data: patient, error: patientError } = await clinician.admin
    .from("patient_registrations")
    .select("id, full_name, date_of_birth")
    .eq("id", admission.patient_id)
    .single();

  if (patientError || !patient) return NextResponse.json({ error: "Alta salva, mas não foi possível carregar os dados do paciente." }, { status: 500 });
  return NextResponse.json({ admission, patient });
}
