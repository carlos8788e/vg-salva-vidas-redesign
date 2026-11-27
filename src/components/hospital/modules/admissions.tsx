import { BedDouble, FileText, Plus } from "lucide-react";
import type { ModuleKey } from "../module-primitives";
import { EmptyState, ModuleHeading, PreviewNotice, SectionCard } from "../module-primitives";

export function AdmissionsModule({ onNavigate }: { onNavigate: (module: ModuleKey) => void }) {
  return (
    <div className="module-stack">
      <ModuleHeading
        eyebrow="Gestão de leitos"
        title="Internações"
        description="Acompanhe ocupação, localização e situação de cada internação."
        actions={
          <button type="button" className="button button-primary" onClick={() => onNavigate("medical")}>
            <Plus aria-hidden="true" size={17} /> Nova internação
          </button>
        }
      />

      <PreviewNotice>
        A lista de internações não está conectada. Não use informações reais nem considere os dados como registro hospitalar.
      </PreviewNotice>

      <div className="summary-grid summary-grid--compact">
        <article className="summary-card summary-card--compact">
          <span className="summary-icon"><BedDouble aria-hidden="true" size={19} /></span>
          <p className="summary-value">—</p>
          <h3>Internações ativas</h3>
          <p className="summary-note">Aguardando conexão segura</p>
        </article>
        <article className="summary-card summary-card--compact">
          <span className="summary-icon summary-icon--amber"><FileText aria-hidden="true" size={19} /></span>
          <p className="summary-value">—</p>
          <h3>Altas registradas hoje</h3>
          <p className="summary-note">Aguardando conexão segura</p>
        </article>
      </div>

      <SectionCard
        title="Pacientes internados"
        description="Quarto, leito, data de entrada e observações de acompanhamento."
        className="table-card"
      >
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Paciente</th>
                <th scope="col">Quarto / ala</th>
                <th scope="col">Leito</th>
                <th scope="col">Entrada</th>
                <th scope="col">Diagnóstico / conduta</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody />
          </table>
        </div>
        <EmptyState
          icon={BedDouble}
          title="Registros indisponíveis"
          description="A lista será carregada após a ativação do acesso seguro ao banco de dados."
          action={
            <button type="button" className="button button-secondary button-small" onClick={() => onNavigate("medical")}>
              Ir para atendimento médico
            </button>
          }
        />
      </SectionCard>
    </div>
  );
}
