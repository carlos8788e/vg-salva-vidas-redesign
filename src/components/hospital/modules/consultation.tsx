import type { FormEvent } from "react";
import { ArrowRight, BedDouble, ClipboardList, FileText, Monitor, UserRound } from "lucide-react";
import type { ModuleKey, NoticeHandler } from "../module-primitives";
import { EmptyState, ModuleHeading, PreviewNotice, SectionCard } from "../module-primitives";

export function ConsultationModule({
  onNotify,
  onNavigate,
}: {
  onNotify: NoticeHandler;
  onNavigate: (module: ModuleKey) => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onNotify("Consulta não registrada. A gravação está bloqueada nesta prévia.");
  }

  return (
    <div className="module-stack">
      <ModuleHeading
        eyebrow="Equipe clínica"
        title="Atendimento médico"
        description="Consulte a fila, registre a avaliação e encaminhe o próximo passo do cuidado."
        actions={
          <button type="button" className="button button-secondary" onClick={() => onNavigate("tv")}>
            <Monitor aria-hidden="true" size={16} /> Abrir painel TV
          </button>
        }
      />

      <PreviewNotice>
        A fila e os prontuários não estão conectados. Não use dados reais; salvar, chamar, internar e dar alta estão indisponíveis nesta prévia.
      </PreviewNotice>

      <div className="consultation-layout">
        <SectionCard
          title="Fila de triagem"
          description="Selecione um paciente para iniciar o atendimento."
          className="consultation-queue"
          actions={<span className="status-chip status-chip--neutral">Aguardando conexão</span>}
        >
          <EmptyState
            icon={ClipboardList}
            title="Nenhum registro carregado"
            description="A lista aparecerá após a configuração da autenticação e da persistência segura."
          />
        </SectionCard>

        <SectionCard
          title="Registro de consulta"
          description="Campos de demonstração — nada será enviado ao banco."
          className="consultation-form-card"
        >
          <form className="form-layout" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="consultation-patient">Paciente selecionado</label>
              <div className="input-with-prefix">
                <UserRound aria-hidden="true" size={17} />
                <input id="consultation-patient" placeholder="Selecione na fila de triagem" readOnly />
              </div>
            </div>

            <div className="quick-call-panel">
              <div>
                <span className="quick-call-icon"><Monitor aria-hidden="true" size={17} /></span>
                <div><strong>Chamada rápida</strong><span>Consultório 01 · sem chamada ativa</span></div>
              </div>
              <button type="button" className="button button-secondary button-small" onClick={() => onNotify("A chamada não foi enviada. O painel ainda não está conectado aos dados.")}>
                Chamar
              </button>
            </div>

            <div className="form-grid form-grid--two">
              <div className="field">
                <label htmlFor="consultation-medication">Medicação prescrita</label>
                <select id="consultation-medication" defaultValue="">
                  <option value="">Selecione</option>
                  <option value="" disabled>Lista disponível após conexão segura</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="consultation-room">Quarto / ala</label>
                <input id="consultation-room" placeholder="Ex.: Ala B" autoComplete="off" />
              </div>
              <div className="field">
                <label htmlFor="consultation-bed">Leito</label>
                <input id="consultation-bed" placeholder="Ex.: 03" autoComplete="off" />
              </div>
              <div className="field field--wide">
                <label htmlFor="consultation-diagnosis">Diagnóstico / conduta</label>
                <input id="consultation-diagnosis" placeholder="Registro realizado pelo profissional" autoComplete="off" />
              </div>
              <div className="field field--wide">
                <label htmlFor="consultation-observations">Observações clínicas</label>
                <textarea id="consultation-observations" rows={4} placeholder="Não insira dados reais nesta prévia" />
              </div>
            </div>

            <div className="form-actions form-actions--stacked">
              <p>Consulta, receita, internação e alta exigem autenticação ativa.</p>
              <div className="form-action-buttons">
                <button type="button" className="button button-outline-danger" onClick={() => onNotify("A alta médica não foi registrada nesta prévia.")}>
                  <FileText aria-hidden="true" size={16} /> Dar alta
                </button>
                <button type="button" className="button button-outline" onClick={() => onNavigate("admissions")}>
                  <BedDouble aria-hidden="true" size={16} /> Internação
                </button>
                <button type="submit" className="button button-primary">
                  Finalizar consulta
                  <ArrowRight aria-hidden="true" size={16} />
                </button>
              </div>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
