import { NextResponse } from "next/server";
import { getAuthorizedClinician } from "@/lib/clinical-auth";

export async function GET() {
  const context = await getAuthorizedClinician();
  if (!context) return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });

  const { data, error } = await context.admin
    .from("patient_registrations")
    .select("id, full_name, date_of_birth, phone, email, status, created_at, payment_type")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: "Não foi possível carregar os pacientes." }, { status: 500 });
  return NextResponse.json({ patients: data });
}

