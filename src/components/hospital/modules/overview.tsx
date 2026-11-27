import {
  Activity,
  ArrowRight,
  BedDouble,
  ClipboardList,
  FileText,
  HeartPulse,
  LockKeyhole,
  Monitor,
  Pill,
  UserRoundPlus,
} from "lucide-react";
import type { ModuleKey, NoticeHandler } from "../module-primitives";
import { ModuleHeading, PreviewNotice, SectionCard } from "../module-primitives";

const summaries = [
  { label: "Pacientes na fila", value: "—", icon: ClipboardList, note: "Aguardando conexão segura" },
  { label: "Triagens em andamento", value: "—", icon: Activity, note: "Aguardando conexão segura" },
  { label: "Leitos ocupados", value: "—", icon: BedDouble, note: "Aguardando conexão segura" },
  { label: "Prescrições hoje", value: "—", icon: Pill, note: "Aguardando conexão segura" },
];

const workflow: {
  number: string;
  title: string;
  text: string;
  icon: typeof UserRoundPlus;
  module: ModuleKey;
}[] = [
  {
    number: "01",
    title: "Cadastro e atendimento",
    text: "Identificação e encaminhamento inicial.",
    icon: UserRoundPlus,
    module: "registration",
  },
  {
    number: "02",
    title: "Triagem",
    text: "Registro de sinais vitais e prioridade clínica.",
    icon: Activity,
    module: "triage",
  },
  {
    number: "03",
    title: "Atendimento médico",
    text: "Consulta, conduta e fluxo de internação.",
    icon: HeartPulse,
    module: "medical",
  },
];

export function OverviewModule({
  onNavigate,
  onNotify,
}: {
  onNavigate: (module: ModuleKey) => void;
  onNotify: NoticeHandler;
}) {
  return (
    <div className="module-stack">
      <ModuleHeading
        eyebrow="Painel operacional"
        title="Visão geral"
        description="Os fluxos do hospital, organizados em um só lugar."
      />

      <PreviewNotice>
        Prévia visual sem conexão com prontuários. Não insira dados reais até que o login e a persistência segura estejam ativos.
      </PreviewNotice>

      <section className="welcome-panel" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <span className="welcome-kicker">Cuidado conectado, equipe alinhada</span>
          <h2 id="welcome-title">Um atendimento mais claro começa aqui.</h2>
          <p>
            Acompanhe cada etapa — do cadastro à alta — em uma interface feita para a rotina hospitalar.
          </p>
          <div className="welcome-actions">
            <button
              type="button"
              className="button button-light"
              onClick={() => onNavigate("registration")}
            >
              <UserRoundPlus aria-hidden="true" size={17} />
              Novo atendimento
            </button>
            <button
              type="button"
              className="button button-ghost-light"
              onClick={() => onNavigate("tv")}
            >
              <Monitor aria-hidden="true" size={17} />
              Painel da TV
            </button>
          </div>
        </div>
        <div className="welcome-emblem" aria-hidden="true">
          <div className="welcome-emblem-ring">
            <HeartPulse size={62} strokeWidth={1.25} />
            <span>VG</span>
          </div>
          <div className="welcome-emblem-dot welcome-emblem-dot-one" />
          <div className="welcome-emblem-dot welcome-emblem-dot-two" />
        </div>
        <div className="welcome-security">
          <LockKeyhole aria-hidden="true" size={15} />
          <span>Dados clínicos bloqueados nesta prévia</span>
        </div>
      </section>

      <section className="summary-grid" aria-label="Resumo do hospital">
        {summaries.map((summary) => {
          const Icon = summary.icon;
          return (
            <article className="summary-card" key={summary.label}>
              <div className="summary-card-top">
                <span className="summary-icon"><Icon aria-hidden="true" size={19} /></span>
                <span className="summary-period">Hoje</span>
              </div>
              <p className="summary-value">{summary.value}</p>
              <h3>{summary.label}</h3>
              <p className="summary-note">{summary.note}</p>
            </article>
          );
        })}
      </section>

      <div className="overview-grid">
        <SectionCard
          title="Fluxo de atendimento"
          description="Acesse cada etapa da jornada do paciente."
          className="workflow-card"
        >
          <div className="workflow-list">
            {workflow.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  type="button"
                  className="workflow-item"
                  key={step.number}
                  onClick={() => onNavigate(step.module)}
                >
                  <span className="workflow-number">{step.number}</span>
                  <span className="workflow-icon"><Icon aria-hidden="true" size={19} /></span>
                  <span className="workflow-copy">
                    <strong>{step.title}</strong>
                    <span>{step.text}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="workflow-arrow" size={17} />
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Acesso rápido"
          description="Outras áreas do sistema."
          className="quick-access-card"
        >
          <div className="quick-access-list">
            <button type="button" onClick={() => onNavigate("admissions")}>
              <span className="quick-access-icon quick-access-icon--amber"><BedDouble aria-hidden="true" size={18} /></span>
              <span><strong>Internações</strong><small>Leitos e altas</small></span>
              <ArrowRight aria-hidden="true" size={16} />
            </button>
            <button type="button" onClick={() => onNavigate("medications")}>
              <span className="quick-access-icon quick-access-icon--mint"><FileText aria-hidden="true" size={18} /></span>
              <span><strong>Medicações</strong><small>Receitas e prescrições</small></span>
              <ArrowRight aria-hidden="true" size={16} />
            </button>
            <button type="button" onClick={() => onNavigate("tv")}>
              <span className="quick-access-icon quick-access-icon--blue"><Monitor aria-hidden="true" size={18} /></span>
              <span><strong>Painel da TV</strong><small>Chamadas de atendimento</small></span>
              <ArrowRight aria-hidden="true" size={16} />
            </button>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Status do ambiente"
        description="O banco contém as estruturas de atendimento, mas o acesso a dados clínicos permanece fechado nesta prévia."
        className="environment-card"
        actions={<span className="status-chip status-chip--pending">Configuração pendente</span>}
      >
        <div className="environment-status">
          <span className="environment-status-icon"><LockKeyhole aria-hidden="true" size={18} /></span>
          <div>
            <strong>Autenticação segura necessária</strong>
            <p>Filas, prontuários e relatórios só serão consultados após a configuração adequada do segredo de sessão.</p>
          </div>
          <button
            type="button"
            className="text-action"
            onClick={() => onNotify("Nenhum dado foi consultado ou salvo nesta prévia.")}
          >
            Entendi
            <ArrowRight aria-hidden="true" size={15} />
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
