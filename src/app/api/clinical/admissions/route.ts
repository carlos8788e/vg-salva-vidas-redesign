import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthorizedClinician } from "@/lib/clinical-auth";

const admissionSchema = z.object({
  patient_id: z.string().uuid(),
  room: z.string().trim().min(1).max(50),
  bed: z.string().trim().min(1).max(30),
  diagnosis: z.string().trim().min(2).max(2000),
});

export async function GET() {
  const context = await getAuthorizedClinician();
  if (!context) return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });

  const { data, error } = await context.admin
    .from("admissions")
    .select("id, patient_id, room, bed, diagnosis, admission_date, status, discharge_date, discharge_summary, discharge_medications, discharge_follow_up, physician_name, patient_registrations(full_name, date_of_birth)")
    .order("admission_date", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: "Não foi possível carregar as internações." }, { status: 500 });
  return NextResponse.json({ admissions: data });
}

export async function POST(request: Request) {
  const context = await getAuthorizedClinician();
  if (!context) return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });

  const parsed = admissionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Confira os dados da internação." }, { status: 400 });

  const { data: patient, error: patientError } = await context.admin
    .from("patient_registrations")
    .select("id, status")
    .eq("id", parsed.data.patient_id)
    .maybeSingle();

  if (patientError || !patient || patient.status === "alta" || patient.status === "internado") {
    return NextResponse.json({ error: "Paciente não disponível para internação." }, { status: 400 });
  }

  const { data, error } = await context.admin.rpc("record_admission", {
    p_patient_id: parsed.data.patient_id,
    p_room: parsed.data.room,
    p_bed: parsed.data.bed,
    p_diagnosis: parsed.data.diagnosis,
  });

  if (error || !data) return NextResponse.json({ error: "Não foi possível registrar a internação." }, { status: 400 });
  return NextResponse.json({ admission: data }, { status: 201 });
}
