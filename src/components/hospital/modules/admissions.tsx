"use client";

import { useState, type FormEvent } from "react";
import useSWR from "swr";
import { BedDouble, CheckCircle2, Download, FileText, LoaderCircle, Plus, UserRound } from "lucide-react";
import type { ModuleKey } from "../module-primitives";
import { EmptyState, ModuleHeading, SectionCard } from "../module-primitives";
import { downloadDischargePdf } from "@/lib/discharge-pdf";

type Patient = { id: string; full_name: string; date_of_birth: string; status: string; created_at: string };
type Admission = {
  id: string;
  patient_id: string;
  room: string;
  bed: string;
  diagnosis: string;
  admission_date: string;
  status: "internado" | "alta";
  discharge_date: string | null;
  discharge_summary: string | null;
  discharge_medications: string | null;
  discharge_follow_up: string | null;
  physician_name: string | null;
  patient_registrations: { full_name: string; date_of_birth: string } | null;
};
type ApiResult<T> = { [key: string]: T[] };

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "same-origin" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Não foi possível carregar os dados.");
  return result;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(value));
}

export function AdmissionsModule({ onNavigate }: { onNavigate: (module: ModuleKey) => void }) {
  const { data: patientsData, error: patientsError, mutate: refreshPatients } = useSWR<ApiResult<Patient>>("/api/clinical/patients", fetcher);
  const { data: admissionsData, error: admissionsError, mutate: refreshAdmissions } = useSWR<ApiResult<Admission>>("/api/clinical/admissions", fetcher);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [discharging, setDischarging] = useState<Admission | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const patients = patientsData?.patients ?? [];
  const admissions = admissionsData?.admissions ?? [];
  const activeAdmissions = admissions.filter((item) => item.status === "internado");
  const dischargedAdmissions = admissions.filter((item) => item.status === "alta");
  const availablePatients = patients.filter((item) => !["internado", "alta"].includes(item.status));

  async function submitAdmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/clinical/admissions", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    }).catch(() => null);
    const result = await response?.json().catch(() => null);
    if (!response?.ok) {
      setMessage(result?.error ?? "Não foi possível registrar a internação.");
      setBusy(false);
      return;
    }
    await Promise.all([refreshAdmissions(), refreshPatients()]);
    setShowAdmissionForm(false);
    setMessage("Internação registrada.");
    setBusy(false);
  }

  async function submitDischarge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!discharging) return;
    setBusy(true);
    setMessage("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch(`/api/clinical/admissions/${discharging.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values),
    }).catch(() => null);
    const result = await response?.json().catch(() => null);
    if (!response?.ok) {
      setMessage(result?.error ?? "Não foi possível registrar a alta.");
      setBusy(false);
      return;
    }
    await Promise.all([refreshAdmissions(), refreshPatients()]);
    setDischarging(null);
    setMessage("Alta registrada. O PDF foi baixado para impressão e entrega ao paciente.");
    setBusy(false);
    const patient = result.patient as { full_name: string; date_of_birth: string };
    const admission = result.admission as Admission;
    downloadDischargePdf({
      patientName: patient.full_name,
      dateOfBirth: formatDate(patient.date_of_birth),
      diagnosis: discharging.diagnosis,
      dischargeSummary: admission.discharge_summary ?? "",
      medications: admission.discharge_medications ?? "",
      followUp: admission.discharge_follow_up ?? "",
      physicianName: admission.physician_name ?? "",
      dischargedAt: formatDate(admission.discharge_date),
    });
  }

  function retryLoad() {
    void refreshAdmissions();
    void refreshPatients();
  }

  return (
    <div className="module-stack">
      <ModuleHeading
        eyebrow="Gestão de leitos"
        title="Internações e altas"
        description="Registre entradas, acompanhe leitos e emita o resumo de alta do paciente."
        actions={<button type="button" className="button button-primary" onClick={() => { setShowAdmissionForm((value) => !value); setDischarging(null); }}><Plus aria-hidden="true" size={17} /> Nova internação</button>}
      />

      {(patientsError || admissionsError) ? <div className="clinical-error" role="alert"><span>{patientsError?.message ?? admissionsError?.message}</span><button type="button" className="text-action" onClick={retryLoad}>Tentar novamente</button></div> : null}
      {message ? <div className="clinical-success" role="status"><CheckCircle2 aria-hidden="true" size={17} />{message}</div> : null}

      <div className="summary-grid summary-grid--compact">
        <article className="summary-card summary-card--compact"><span className="summary-icon"><BedDouble aria-hidden="true" size={19} /></span><p className="summary-value">{activeAdmissions.length}</p><h3>Internações ativas</h3><p className="summary-note">Leitos atualmente ocupados</p></article>
        <article className="summary-card summary-card--compact"><span className="summary-icon summary-icon--amber"><FileText aria-hidden="true" size={19} /></span><p className="summary-value">{dischargedAdmissions.length}</p><h3>Altas registradas</h3><p className="summary-note">Histórico disponível para consulta</p></article>
      </div>

      {showAdmissionForm ? <SectionCard title="Registrar internação" description="Selecione um paciente cadastrado e informe a localização e o diagnóstico."><form className="form-layout" onSubmit={submitAdmission}>
        <div className="form-grid form-grid--two">
          <div className="field field--wide"><label htmlFor="admission-patient">Paciente <span aria-hidden="true">*</span></label><select id="admission-patient" name="patient_id" required defaultValue=""><option value="" disabled>Selecione um paciente</option>{availablePatients.map((patient) => <option key={patient.id} value={patient.id}>{patient.full_name} · {formatDate(patient.date_of_birth)}</option>)}</select>{availablePatients.length === 0 ? <span className="field-hint">Cadastre um paciente antes de iniciar a internação.</span> : null}</div>
          <div className="field"><label htmlFor="admission-room">Quarto / ala <span aria-hidden="true">*</span></label><input id="admission-room" name="room" required maxLength={50} /></div>
          <div className="field"><label htmlFor="admission-bed">Leito <span aria-hidden="true">*</span></label><input id="admission-bed" name="bed" required maxLength={30} /></div>
          <div className="field field--wide"><label htmlFor="admission-diagnosis">Diagnóstico / motivo da internação <span aria-hidden="true">*</span></label><textarea id="admission-diagnosis" name="diagnosis" rows={3} required maxLength={2000} /></div>
        </div>
        <div className="form-actions"><p>O horário de entrada será registrado automaticamente.</p><button type="submit" className="button button-primary" disabled={busy || availablePatients.length === 0}>{busy ? "Salvando…" : "Registrar internação"}</button></div>
      </form></SectionCard> : null}

      {discharging ? <SectionCard title={`Alta · ${discharging.patient_registrations?.full_name ?? "Paciente"}`} description="Preencha o resumo e as orientações que serão salvos no prontuário e incluídos no PDF."><form className="form-layout" onSubmit={submitDischarge}>
        <div className="form-grid form-grid--two">
          <div className="field field--wide"><label htmlFor="discharge-summary">Resumo clínico da alta <span aria-hidden="true">*</span></label><textarea id="discharge-summary" name="summary" rows={4} required minLength={5} maxLength={5000} /></div>
          <div className="field"><label htmlFor="discharge-medications">Medicações e orientações</label><textarea id="discharge-medications" name="medications" rows={4} maxLength={3000} /></div>
          <div className="field"><label htmlFor="discharge-follow-up">Acompanhamento recomendado</label><textarea id="discharge-follow-up" name="followUp" rows={4} maxLength={3000} /></div>
          <div className="field field--wide"><label htmlFor="discharge-physician">Profissional responsável <span aria-hidden="true">*</span></label><input id="discharge-physician" name="physicianName" required minLength={2} maxLength={150} /></div>
        </div>
        <div className="form-actions"><p>A alta e a atualização do status serão gravadas juntas.</p><div className="form-action-buttons"><button type="button" className="button button-secondary" onClick={() => setDischarging(null)} disabled={busy}>Cancelar</button><button type="submit" className="button button-primary" disabled={busy}>{busy ? "Salvando…" : "Registrar alta e baixar PDF"}<Download aria-hidden="true" size={16} /></button></div></div>
      </form></SectionCard> : null}

      <SectionCard title="Pacientes internados" description="Registros ativos e localização atual." className="table-card">
        {activeAdmissions.length === 0 && !admissionsError ? <EmptyState icon={BedDouble} title={admissionsData ? "Nenhuma internação ativa" : "Carregando internações"} description={admissionsData ? "Os pacientes internados aparecerão aqui." : "Consultando registros autorizados."} action={!admissionsData ? <LoaderCircle className="spin-icon" aria-label="Carregando" size={18} /> : undefined} /> : null}
        {activeAdmissions.length > 0 ? <div className="table-scroll"><table className="data-table"><thead><tr><th scope="col">Paciente</th><th scope="col">Quarto / ala</th><th scope="col">Leito</th><th scope="col">Entrada</th><th scope="col">Diagnóstico / conduta</th><th scope="col">Ação</th></tr></thead><tbody>{activeAdmissions.map((admission) => <tr key={admission.id}><td><strong>{admission.patient_registrations?.full_name ?? "Paciente"}</strong><small>{formatDate(admission.patient_registrations?.date_of_birth ?? null)}</small></td><td>{admission.room}</td><td>{admission.bed}</td><td>{formatDate(admission.admission_date)}</td><td>{admission.diagnosis}</td><td><button type="button" className="button button-secondary button-small" onClick={() => { setDischarging(admission); setShowAdmissionForm(false); setMessage(""); }}><CheckCircle2 aria-hidden="true" size={15} /> Dar alta</button></td></tr>)}</tbody></table></div> : null}
      </SectionCard>

      {dischargedAdmissions.length > 0 ? <SectionCard title="Altas recentes" description="Registros de alta salvos no prontuário."><div className="table-scroll"><table className="data-table"><thead><tr><th scope="col">Paciente</th><th scope="col">Diagnóstico</th><th scope="col">Data da alta</th><th scope="col">Profissional</th><th scope="col">Documento</th></tr></thead><tbody>{dischargedAdmissions.map((admission) => <tr key={admission.id}><td><strong>{admission.patient_registrations?.full_name ?? "Paciente"}</strong></td><td>{admission.diagnosis}</td><td>{formatDate(admission.discharge_date)}</td><td>{admission.physician_name || "—"}</td><td><button type="button" className="button button-secondary button-small" onClick={() => { const patient = admission.patient_registrations; if (patient) downloadDischargePdf({ patientName: patient.full_name, dateOfBirth: formatDate(patient.date_of_birth), diagnosis: admission.diagnosis, dischargeSummary: admission.discharge_summary ?? "", medications: admission.discharge_medications ?? "", followUp: admission.discharge_follow_up ?? "", physicianName: admission.physician_name ?? "", dischargedAt: formatDate(admission.discharge_date) }); }}><Download aria-hidden="true" size={15} /> Baixar PDF</button></td></tr>)}</tbody></table></div></SectionCard> : null}

      {patients.length === 0 && patientsData && !patientsError ? <SectionCard title="Ainda sem pacientes cadastrados" description="Cadastros públicos aparecerão nesta lista após o envio do formulário."><div className="empty-state-action"><UserRound aria-hidden="true" size={18} /><button type="button" className="text-action" onClick={() => onNavigate("registration")}>Abrir recepção</button></div></SectionCard> : null}
    </div>
  );
}
