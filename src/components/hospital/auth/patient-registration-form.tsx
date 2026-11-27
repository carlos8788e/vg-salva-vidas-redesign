"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, HeartPulse, Send } from "lucide-react";

export function PatientRegistrationForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);

    if (!response?.ok) {
      const result = await response?.json().catch(() => null);
      setMessage(result?.error ?? "Não foi possível enviar o cadastro. Tente novamente.");
      setBusy(false);
      return;
    }

    setSubmitted(true);
    setBusy(false);
  }

  if (submitted) {
    return (
      <main className="patient-registration-screen">
        <section className="patient-registration-card patient-success" role="status">
          <span className="patient-success-icon"><CheckCircle2 aria-hidden="true" size={30} /></span>
          <p className="auth-eyebrow">VG Salva Vidas</p>
          <h1>Cadastro enviado</h1>
          <p>Recebemos seus dados com segurança. Nossa equipe poderá localizar seu cadastro no atendimento.</p>
          <Link href="/" className="button button-primary"><ArrowLeft aria-hidden="true" size={17} /> Voltar ao início</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="patient-registration-screen">
      <section className="patient-registration-card" aria-labelledby="patient-registration-title">
        <Link href="/" className="patient-back-link"><ArrowLeft aria-hidden="true" size={16} /> Início</Link>
        <div className="patient-form-heading">
          <span className="auth-brand-mark"><HeartPulse aria-hidden="true" size={27} /></span>
          <p className="auth-eyebrow">VG Salva Vidas · Cadastro público</p>
          <h1 id="patient-registration-title">Cadastro de paciente</h1>
          <p>Preencha seus dados para agilizar a recepção. Não é necessário criar usuário ou senha.</p>
        </div>
        <form className="form-layout patient-public-form" onSubmit={handleSubmit}>
          <div className="form-section-label"><div><strong>Identificação</strong><span>Campos marcados com * são obrigatórios.</span></div></div>
          <div className="form-grid form-grid--two">
            <div className="field field--wide"><label htmlFor="public-full-name">Nome completo <span aria-hidden="true">*</span></label><input id="public-full-name" name="full_name" autoComplete="name" maxLength={150} required /></div>
            <div className="field"><label htmlFor="public-birth">Data de nascimento <span aria-hidden="true">*</span></label><input id="public-birth" name="date_of_birth" type="date" autoComplete="bday" max={new Date().toISOString().slice(0, 10)} required /></div>
            <div className="field"><label htmlFor="public-sex">Sexo</label><select id="public-sex" name="sex" defaultValue=""><option value="">Prefiro não informar</option><option value="feminino">Feminino</option><option value="masculino">Masculino</option><option value="outro">Outro</option><option value="nao-informado">Prefiro não informar</option></select></div>
            <div className="field"><label htmlFor="public-doc-type">Documento</label><select id="public-doc-type" name="document_type" defaultValue=""><option value="">Selecione</option><option value="cpf">CPF</option><option value="rg">RG</option><option value="cns">Cartão SUS</option></select></div>
            <div className="field"><label htmlFor="public-doc-number">Número do documento</label><input id="public-doc-number" name="document_number" autoComplete="off" maxLength={40} /></div>
            <div className="field"><label htmlFor="public-mother">Nome da mãe</label><input id="public-mother" name="mother_name" autoComplete="off" maxLength={150} /></div>
            <div className="field"><label htmlFor="public-marital">Estado civil</label><select id="public-marital" name="marital_status" defaultValue=""><option value="">Selecione</option><option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option><option>Outro</option></select></div>
            <div className="field"><label htmlFor="public-phone">Telefone</label><input id="public-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} /></div>
            <div className="field"><label htmlFor="public-email">E-mail</label><input id="public-email" name="email" type="email" autoComplete="email" maxLength={254} /></div>
            <div className="field field--wide"><label htmlFor="public-address">Endereço</label><input id="public-address" name="address" autoComplete="street-address" maxLength={300} /></div>
          </div>
          <div className="form-divider" />
          <div className="form-section-label"><div><strong>Contato de emergência</strong><span>Informação opcional para contato em caso de necessidade.</span></div></div>
          <div className="form-grid form-grid--two">
            <div className="field"><label htmlFor="public-emergency-name">Nome</label><input id="public-emergency-name" name="emergency_contact_name" maxLength={150} /></div>
            <div className="field"><label htmlFor="public-emergency-phone">Telefone</label><input id="public-emergency-phone" name="emergency_contact_phone" type="tel" maxLength={30} /></div>
            <div className="field"><label htmlFor="public-emergency-relation">Vínculo</label><input id="public-emergency-relation" name="emergency_relationship" maxLength={60} placeholder="Ex.: familiar" /></div>
            <div className="field"><label htmlFor="public-payment">Tipo de atendimento</label><select id="public-payment" name="payment_type" defaultValue=""><option value="">Selecione</option><option value="sus">SUS</option><option value="convenio">Convênio</option><option value="particular">Particular</option></select></div>
          </div>
          <p className="patient-privacy-note">Seus dados são enviados ao hospital. Não informe dados de saúde neste formulário.</p>
          {message ? <p className="auth-message" role="alert">{message}</p> : null}
          <div className="form-actions"><p>Ao enviar, você autoriza o uso dos dados para o atendimento hospitalar.</p><button type="submit" className="button button-primary" disabled={busy}>{busy ? "Enviando…" : "Enviar cadastro"}<Send aria-hidden="true" size={16} /></button></div>
        </form>
      </section>
    </main>
  );
}
