"use client";

import { useState, type FormEvent } from "react";
import { Activity, ArrowRight, ClipboardList, HeartPulse } from "lucide-react";
import type { NoticeHandler } from "../module-primitives";
import { EmptyState, ModuleHeading, PreviewNotice, SectionCard } from "../module-primitives";

const riskOptions = [
  { id: "vermelho", label: "Emergência", detail: "Atendimento imediato" },
  { id: "amarelo", label: "Urgente", detail: "Prioridade elevada" },
  { id: "verde", label: "Pouco urgente", detail: "Aguardar avaliação" },
  { id: "azul", label: "Não urgente", detail: "Fluxo de menor prioridade" },
];

export function TriageModule({ onNotify }: { onNotify: NoticeHandler }) {
  const [selectedRisk, setSelectedRisk] = useState("verde");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onNotify("Triagem não registrada. A seleção foi apenas visual e não foi enviada.");
  }

  return (
    <div className="module-stack">
      <ModuleHeading
        eyebrow="Classificação assistencial"
        title="Triagem hospitalar"
        description="Registre sinais vitais e organize a avaliação inicial da equipe."
        actions={<span className="status-chip status-chip--neutral">Classificação manual</span>}
      />

      <PreviewNotice>
        Não insira dados clínicos reais. A sugestão automática não está ativa nesta prévia; a classificação deve ser definida e validada por profissional habilitado.
      </PreviewNotice>

      <div className="triage-layout">
        <SectionCard
          title="Avaliação inicial"
          description="Os campos abaixo são demonstrativos e não serão salvos."
          className="triage-form-card"
        >
          <form className="form-layout" onSubmit={handleSubmit}>
            <div className="form-grid form-grid--two">
              <div className="field field--wide">
                <label htmlFor="triage-patient-name">Nome do paciente <span aria-hidden="true">*</span></label>
                <input id="triage-patient-name" autoComplete="off" placeholder="Identificação do paciente" required />
              </div>
              <div className="field field--wide">
                <label htmlFor="triage-complaint">Queixa principal <span aria-hidden="true">*</span></label>
                <textarea id="triage-complaint" rows={3} placeholder="Descreva a queixa relatada" required />
              </div>
            </div>

            <div className="form-divider" />
            <div className="form-section-label">
              <span className="form-section-icon"><HeartPulse aria-hidden="true" size={17} /></span>
              <div>
                <strong>Sinais vitais</strong>
                <span>Preencha conforme avaliação clínica.</span>
              </div>
            </div>
            <div className="form-grid form-grid--four">
              <div className="field">
                <label htmlFor="triage-temperature">Temperatura</label>
                <div className="input-with-suffix"><input id="triage-temperature" type="number" step="0.1" min="25" max="45" placeholder="36,5" /><span>°C</span></div>
              </div>
              <div className="field">
                <label htmlFor="triage-blood-pressure">Pressão arterial</label>
                <input id="triage-blood-pressure" placeholder="120/80" autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="triage-oxygen">Saturação O₂</label>
                <div className="input-with-suffix"><input id="triage-oxygen" type="number" min="0" max="100" placeholder="98" /><span>%</span></div>
              </div>
              <div className="field">
                <label htmlFor="triage-heart-rate">Frequência cardíaca</label>
                <div className="input-with-suffix"><input id="triage-heart-rate" type="number" min="0" max="300" placeholder="80" /><span>bpm</span></div>
              </div>
            </div>

            <div className="form-grid form-grid--two">
              <div className="field">
                <label htmlFor="triage-pain">Escala de dor</label>
                <select id="triage-pain" defaultValue="">
                  <option value="">Selecione</option>
                  <option value="0">0 — Sem dor</option>
                  <option value="1-3">1 a 3 — Leve</option>
                  <option value="4-6">4 a 6 — Moderada</option>
                  <option value="7-9">7 a 9 — Intensa</option>
                  <option value="10">10 — Máxima</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="triage-allergies">Alergias conhecidas</label>
                <input id="triage-allergies" autoComplete="off" placeholder="Não use informações reais nesta prévia" />
              </div>
              <div className="field field--wide">
                <label htmlFor="triage-notes">Observações da equipe</label>
                <textarea id="triage-notes" rows={3} placeholder="Histórico e observações relevantes" />
              </div>
            </div>

            <fieldset className="risk-fieldset">
              <legend>Prioridade definida pela equipe</legend>
              <div className="risk-options">
                {riskOptions.map((risk) => (
                  <button
                    key={risk.id}
                    type="button"
                    className={`risk-option risk-option--${risk.id}${selectedRisk === risk.id ? " is-selected" : ""}`}
                    aria-pressed={selectedRisk === risk.id}
                    onClick={() => setSelectedRisk(risk.id)}
                  >
                    <span className="risk-option-marker" />
                    <span><strong>{risk.label}</strong><small>{risk.detail}</small></span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="form-actions">
              <p>Esta prévia não calcula risco nem envia dados.</p>
              <button type="submit" className="button button-primary">
                Pré-visualizar triagem
                <ArrowRight aria-hidden="true" size={16} />
              </button>
            </div>
          </form>
        </SectionCard>

        <div className="triage-side-column">
          <SectionCard
            title="Fila de espera"
            description="Pacientes aguardando avaliação."
            actions={<span className="status-chip status-chip--neutral">Sem conexão</span>}
          >
            <EmptyState
              icon={ClipboardList}
              title="Fila não carregada"
              description="A lista ficará disponível quando o acesso seguro aos dados estiver configurado."
            />
          </SectionCard>
          <div className="clinical-note-card">
            <span className="clinical-note-icon"><Activity aria-hidden="true" size={18} /></span>
            <div>
              <strong>Decisão assistencial</strong>
              <p>Os campos de prioridade são controles de interface. Não substituem protocolo clínico nem julgamento profissional.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
