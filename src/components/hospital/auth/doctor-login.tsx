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
      setMessage("O e-mail autorizado da equipe ainda não foi configurado.");
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
          setMessage("O e-mail da conta ainda não foi confirmado. Reenvie a confirmação abaixo e depois tente entrar novamente.");
        } else if (error.status === 429 || error.code === "over_request_rate_limit") {
          setMessage("Houve muitas tentativas. Aguarde um pouco antes de tentar novamente.");
        } else if (error.code === "invalid_credentials") {
          setMessage("Senha incorreta. Confira a senha ou use “Esqueci minha senha” para redefini-la.");
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

  async function resendConfirmation() {
    if (!clinicianEmail) {
      setMessage("O e-mail autorizado da equipe ainda não foi configurado.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const redirectTo = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`;
      const { error } = await createClient().auth.resend({
        type: "signup",
        email: clinicianEmail,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        setMessage(error.status === 429
          ? "Houve muitas solicitações. Aguarde um pouco antes de pedir outro e-mail."
          : "Não foi possível reenviar a confirmação agora. Tente novamente mais tarde.");
        return;
      }
      setMessage("Se a conta precisar de confirmação, enviaremos um novo link para o e-mail autorizado. Confira também a caixa de spam.");
    } catch {
      setMessage("Não foi possível reenviar a confirmação. Verifique sua conexão e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function activateAccount() {
    if (!clinicianEmail) {
      setMessage("O e-mail autorizado da equipe ainda não foi configurado.");
      return;
    }
    if (password.length < 8) {
      setMessage("Para ativar a conta pela primeira vez, escolha uma senha com pelo menos 8 caracteres.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: clinicianEmail,
        password,
        options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setMessage(error.status === 429
          ? "Houve muitas tentativas. Aguarde um pouco antes de tentar novamente."
          : "Não foi possível ativar a conta. Se ela já foi criada, use “Esqueci minha senha”.");
        return;
      }
      setMessage("Se esta for sua primeira ativação, confira o e-mail autorizado e confirme o link. Se já tiver conta, use “Esqueci minha senha”.");
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
        <p className="auth-intro">Entre no painel seguro da equipe médica.</p>
        <div className="auth-account-pill"><span>E-mail médico autorizado</span><strong>{clinicianEmail || "Não configurado"}</strong></div>
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
            <p className="auth-password-guidance">No primeiro acesso, escolha uma senha de pelo menos 8 caracteres. Se já tem conta, entre normalmente ou redefina a senha.</p>
          </div>
          {message ? <p className="auth-message" role="status" aria-live="polite">{message}</p> : null}
          <button type="submit" className="button button-primary auth-submit" disabled={busy}>{busy ? "Verificando…" : "Entrar no sistema"}<ArrowRight aria-hidden="true" size={17} /></button>
          <button type="button" className="auth-link-button" onClick={resendConfirmation} disabled={busy || !clinicianEmail}>Reenviar e-mail de confirmação</button>
          <button type="button" className="auth-link-button" onClick={requestPasswordReset} disabled={busy || !clinicianEmail}>Esqueci minha senha</button>
          <button type="button" className="auth-link-button" onClick={activateAccount} disabled={busy || !clinicianEmail}>Primeiro acesso? Ativar conta médica</button>
        </form>
        <div className="auth-security-note"><ShieldCheck aria-hidden="true" size={16} /><span>Acesso restrito ao e-mail médico autorizado e protegido pelo Supabase.</span></div>
        <Link className="auth-public-link" href="/cadastro">Sou paciente — fazer cadastro</Link>
      </section>
    </main>
  );
}
