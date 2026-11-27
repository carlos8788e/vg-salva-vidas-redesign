"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function DoctorLogin({ clinicianEmail, onAuthenticated }: { clinicianEmail: string; onAuthenticated: () => void }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clinicianEmail) {
      setMessage("O e-mail autorizado da equipe ainda não foi configurado.");
      return;
    }
    setBusy(true);
    setMessage("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email: clinicianEmail, password });
    if (error || data.user?.email?.toLowerCase() !== clinicianEmail.toLowerCase()) {
      if (data.session) await supabase.auth.signOut();
      setMessage(error?.message.toLowerCase().includes("confirm") ? "Confirme o e-mail da conta médica antes de entrar." : "Não foi possível entrar. Confira a senha e tente novamente.");
      setBusy(false);
      return;
    }
    setBusy(false);
    onAuthenticated();
  }

  async function requestPasswordReset() {
    if (!clinicianEmail) {
      setMessage("O e-mail autorizado da equipe ainda não foi configurado.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const redirectTo = new URL(
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
      );
      redirectTo.searchParams.set("next", "/auth/reset-password");
      const { error } = await createClient().auth.resetPasswordForEmail(clinicianEmail, {
        redirectTo: redirectTo.toString(),
      });
      if (error) throw error;
      setMessage("Se a conta puder redefinir a senha, enviaremos um link para o e-mail autorizado.");
    } catch {
      setMessage("Não foi possível solicitar a redefinição agora. Tente novamente mais tarde.");
    } finally {
      setBusy(false);
    }
  }

  async function activateAccount() {
    if (!clinicianEmail) {
      setMessage("O e-mail autorizado da equipe ainda não foi configurado.");
      return;
    }
    setBusy(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: clinicianEmail,
      password,
      options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setMessage(error.code === "weak_password" ? "Escolha uma senha forte, com pelo menos 8 caracteres." : error.status === 429 ? "Muitas tentativas. Aguarde um pouco e tente novamente." : "Não foi possível ativar a conta. Confira a senha e tente novamente.");
    } else {
      setMessage("Enviamos um link de confirmação para o e-mail médico autorizado.");
    }
    setBusy(false);
  }

  return (
    <main className="auth-screen">
      <section className="auth-card" aria-labelledby="doctor-login-title">
        <div className="auth-brand-mark" aria-hidden="true"><Activity size={28} /></div>
        <p className="auth-eyebrow">VG Salva Vidas · Acesso clínico</p>
        <h1 id="doctor-login-title">Bem-vindo de volta</h1>
        <p className="auth-intro">Entre no painel seguro da equipe médica.</p>
        <div className="auth-account-pill"><span>E-mail médico autorizado</span><strong>{clinicianEmail || "Não configurado"}</strong></div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field"><label htmlFor="doctor-password">Senha</label><div className="auth-input-wrap"><LockKeyhole aria-hidden="true" size={17} /><input id="doctor-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required placeholder="Sua senha segura" /></div></div>
          {message ? <p className="auth-message" role="status">{message}</p> : null}
          <button type="submit" className="button button-primary auth-submit" disabled={busy}>{busy ? "Verificando…" : "Entrar no sistema"}<ArrowRight aria-hidden="true" size={17} /></button>
          <button type="button" className="auth-link-button" onClick={requestPasswordReset} disabled={busy || !clinicianEmail}>Esqueci minha senha</button>
          <button type="button" className="auth-link-button" onClick={activateAccount} disabled={busy || password.length < 8}>Ativar a conta médica pela primeira vez</button>
        </form>
        <div className="auth-security-note"><ShieldCheck aria-hidden="true" size={16} /><span>Acesso restrito ao e-mail médico autorizado e protegido pelo Supabase.</span></div>
        <Link className="auth-public-link" href="/cadastro">Sou paciente — fazer cadastro</Link>
      </section>
    </main>
  );
}
