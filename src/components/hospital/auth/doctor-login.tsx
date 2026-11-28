"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Activity, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function DoctorLogin({ clinicianEmail, onAuthenticated }: { clinicianEmail: string; onAuthenticated: () => void }) {
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clinicianEmail) {
      setMessage("O acesso médico ainda não está configurado.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email: clinicianEmail, password });

      if (error) {
        const needsConfirmation = error.code === "email_not_confirmed" || error.message.toLowerCase().includes("confirm");
        if (needsConfirmation) {
          setMessage("A conta médica ainda precisa de liberação pelo administrador do sistema.");
        } else if (error.status === 429 || error.code === "over_request_rate_limit") {
          setMessage("Houve muitas tentativas. Aguarde um pouco antes de tentar novamente.");
        } else if (error.code === "invalid_credentials") {
          setMessage("Senha incorreta. Tente novamente.");
        } else {
          setMessage("Não foi possível conectar ao acesso clínico. Verifique sua conexão e tente novamente.");
        }
        return;
      }

      if (data.user?.email?.toLowerCase() !== clinicianEmail.toLowerCase()) {
        if (data.session) await supabase.auth.signOut();
        setMessage("Esta conta não corresponde ao e-mail médico autorizado.");
        return;
      }

      onAuthenticated();
    } catch {
      setMessage("Não foi possível conectar ao acesso clínico. Verifique sua conexão e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card" aria-labelledby="doctor-login-title">
        <div className="auth-brand-mark" aria-hidden="true"><Activity size={28} /></div>
        <p className="auth-eyebrow">VG Salva Vidas · Acesso clínico</p>
        <h1 id="doctor-login-title">Bem-vindo de volta</h1>
        <p className="auth-intro">Acesse o painel médico com sua senha.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="doctor-password">Senha</label>
            <div className="auth-input-wrap">
              <LockKeyhole aria-hidden="true" size={17} />
              <input id="doctor-password" type={passwordVisible ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Digite sua senha" />
              <button type="button" className="auth-password-toggle" aria-label={passwordVisible ? "Ocultar senha" : "Mostrar senha"} aria-pressed={passwordVisible} onClick={() => setPasswordVisible((visible) => !visible)} disabled={busy}>
                {passwordVisible ? <EyeOff aria-hidden="true" size={17} /> : <Eye aria-hidden="true" size={17} />}
              </button>
            </div>
            <p className="auth-password-guidance">Use sua senha individual. Não a compartilhe.</p>
          </div>
          {message ? <p className="auth-message" role="status" aria-live="polite">{message}</p> : null}
          <button type="submit" className="button button-primary auth-submit" disabled={busy}>{busy ? "Verificando…" : "Entrar no sistema"}<ArrowRight aria-hidden="true" size={17} /></button>
        </form>
        <div className="auth-security-note"><ShieldCheck aria-hidden="true" size={16} /><span>Acesso clínico individual protegido pelo Supabase.</span></div>
        <Link className="auth-public-link" href="/cadastro">Sou paciente — fazer cadastro</Link>
      </section>
    </main>
  );
}
