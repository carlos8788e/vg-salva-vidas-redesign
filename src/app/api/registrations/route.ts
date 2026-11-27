import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const registrationSchema = z.object({
  full_name: z.string().trim().min(2).max(150),
  date_of_birth: z.string().date(),
  sex: z.enum(["feminino", "masculino", "outro", "nao-informado"]).nullable().optional(),
  document_type: z.enum(["cpf", "rg", "cns"]).nullable().optional(),
  document_number: z.string().trim().max(40).nullable().optional(),
  mother_name: z.string().trim().max(150).nullable().optional(),
  marital_status: z.string().trim().max(40).nullable().optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  email: z.union([z.string().trim().email().max(254), z.literal("")]).nullable().optional(),
  address: z.string().trim().max(300).nullable().optional(),
  emergency_contact_name: z.string().trim().max(150).nullable().optional(),
  emergency_contact_phone: z.string().trim().max(30).nullable().optional(),
  emergency_relationship: z.string().trim().max(60).nullable().optional(),
  payment_type: z.enum(["sus", "convenio", "particular"]).nullable().optional(),
});

export async function POST(request: Request) {
  const rawBody = await request.json().catch(() => null);
  const normalizedBody = rawBody && typeof rawBody === "object" && !Array.isArray(rawBody)
    ? Object.fromEntries(Object.entries(rawBody).map(([key, value]) => [key, value === "" ? null : value]))
    : rawBody;
  const parsed = registrationSchema.safeParse(normalizedBody);

  if (!parsed.success) {
    return NextResponse.json({ error: "Confira os campos do cadastro." }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } },
  );
  const values = Object.fromEntries(
    Object.entries(parsed.data).map(([key, value]) => [key, value === "" ? null : value]),
  );
  const { error } = await supabase.from("patient_registrations").insert(values);

  if (error) {
    return NextResponse.json({ error: "Não foi possível concluir o cadastro. Tente novamente." }, { status: 400 });
  }

  return NextResponse.json({ message: "Cadastro enviado com sucesso." }, { status: 201 });
}
