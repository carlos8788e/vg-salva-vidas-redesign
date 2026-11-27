import { ArrowRight, FileText, Pill, Plus } from "lucide-react";
import type { ModuleKey } from "../module-primitives";
import { EmptyState, ModuleHeading, PreviewNotice, SectionCard } from "../module-primitives";

export function MedicationsModule({ onNavigate }: { onNavigate: (module: ModuleKey) => void }) {
  return (
    <div className="module-stack">
      <ModuleHeading
        eyebrow="Prescrições"
        title="Medicações"
        description="Consulte prescrições e mantenha as orientações organizadas por atendimento."
        actions={
          <button type="button" className="button button-primary" onClick={() => onNavigate("medical")}>
            <Plus aria-hidden="true" size={17} /> Nova prescrição
          </button>
        }
      />

      <PreviewNotice>
        Prescrições e receitas dependem de sessão profissional e dados clínicos verificados. Nenhuma informação está carregada nesta prévia.
      </PreviewNotice>

      <SectionCard
        title="Prescrições recentes"
        description="A busca e a geração de documentos serão habilitadas após conectar o fluxo seguro."
        actions={<span className="status-chip status-chip--neutral">Sem dados conectados</span>}
        className="table-card"
      >
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Paciente</th>
                <th scope="col">Medicação</th>
                <th scope="col">Diagnóstico</th>
                <th scope="col">Data</th>
                <th scope="col">Documento</th>
              </tr>
            </thead>
            <tbody />
          </table>
        </div>
        <EmptyState
          icon={Pill}
          title="Nenhuma prescrição carregada"
          description="As prescrições vinculadas a consultas aparecerão aqui quando a integração segura estiver ativa."
          action={
            <button type="button" className="button button-secondary button-small" onClick={() => onNavigate("medical")}>
              <FileText aria-hidden="true" size={15} /> Acessar registro médico
              <ArrowRight aria-hidden="true" size={15} />
            </button>
          }
        />
      </SectionCard>
    </div>
  );
}
