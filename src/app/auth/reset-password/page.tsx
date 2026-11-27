"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmation) {
      setMessage("As senhas não coincidem.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) {
        setMessage("O link pode ter expirado. Solicite uma nova redefinição e tente novamente.");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setMessage("Não foi possível atualizar a senha. Solicite um novo link e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card" aria-labelledby="reset-password-title">
        <div className="auth-brand-mark" aria-hidden="true"><Activity size={28} /></div>
        <p className="auth-eyebrow">VG Salva Vidas · Acesso clínico</p>
        <h1 id="reset-password-title">Crie uma nova senha</h1>
        <p className="auth-intro">Escolha uma senha única que você consiga lembrar e que não seja uma data ou informação pessoal.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="new-password">Nova senha</label>
            <div className="auth-input-wrap">
              <LockKeyhole aria-hidden="true" size={17} />
              <input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="confirm-password">Confirme a nova senha</label>
            <div className="auth-input-wrap">
              <LockKeyhole aria-hidden="true" size={17} />
              <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
            </div>
          </div>
          {message ? <p className="auth-message" role="status" aria-live="polite">{message}</p> : null}
          <button type="submit" className="button button-primary auth-submit" disabled={busy}>
            {busy ? "Atualizando…" : "Salvar nova senha"}
          </button>
        </form>
        <Link className="auth-public-link" href="/">Voltar ao acesso clínico</Link>
      </section>
    </main>
  );
}
