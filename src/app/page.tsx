import { Suspense } from "react";
import { Activity } from "lucide-react";
import { HospitalApp } from "@/components/hospital/hospital-app";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="auth-screen">
          <section className="auth-card auth-loading" role="status" aria-live="polite">
            <div className="auth-brand-mark" aria-hidden="true"><Activity size={28} /></div>
            <p className="auth-eyebrow">VG Salva Vidas · Acesso clínico</p>
            <h1>Validando sua sessão</h1>
            <p className="auth-intro">Aguarde enquanto protegemos seu acesso ao painel.</p>
          </section>
        </main>
      }
    >
      <AuthenticatedHome />
    </Suspense>
  );
}

async function AuthenticatedHome() {
  await connection();
  const clinicianEmail = process.env.CLINICIAN_EMAIL?.trim().toLowerCase() ?? "";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const initiallyAuthenticated = Boolean(
    clinicianEmail && user?.email && user.email.toLowerCase() === clinicianEmail,
  );

  return <HospitalApp clinicianEmail={clinicianEmail} initiallyAuthenticated={initiallyAuthenticated} />;
}
