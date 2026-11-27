"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Monitor, Radio, ShieldCheck } from "lucide-react";
import type { NoticeHandler } from "../module-primitives";
import { ModuleHeading, PreviewNotice } from "../module-primitives";

export function TvDisplayModule({ onNotify }: { onNotify: NoticeHandler }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="module-stack">
      <ModuleHeading
        eyebrow="Comunicação com pacientes"
        title="Painel da TV"
        description="Uma tela clara e acolhedora para chamadas de atendimento."
        actions={
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setExpanded((current) => !current)}
            aria-pressed={expanded}
          >
            {expanded ? <Minimize2 aria-hidden="true" size={16} /> : <Maximize2 aria-hidden="true" size={16} />}
            {expanded ? "Restaurar painel" : "Expandir painel"}
          </button>
        }
      />

      <PreviewNotice>
        O painel está em modo demonstrativo e não recebe chamadas. Para proteger a privacidade, nenhum nome de paciente é exibido.
      </PreviewNotice>

      <section className={`tv-screen${expanded ? " tv-screen--expanded" : ""}`} aria-label="Prévia do painel de chamadas">
        <div className="tv-screen-topline">
          <div className="tv-brand-lockup">
            <span className="tv-brand-mark"><ShieldCheck aria-hidden="true" size={21} /></span>
            <div><strong>VG Salva Vidas</strong><span>Central de atendimento</span></div>
          </div>
          <span className="tv-live-status"><span /> Prévia sem conexão</span>
        </div>
        <div className="tv-screen-content">
          <div className="tv-screen-icon"><Radio aria-hidden="true" size={30} strokeWidth={1.6} /></div>
          <p className="tv-screen-eyebrow">Painel de chamadas</p>
          <h2>Aguardando chamada</h2>
          <p className="tv-screen-description">As chamadas aparecerão aqui quando o painel estiver conectado ao fluxo de atendimento.</p>
          <div className="tv-room-placeholder">
            <Monitor aria-hidden="true" size={16} />
            <span>Consultório</span>
            <strong>—</strong>
          </div>
        </div>
        <div className="tv-screen-footer">
          <span>Por favor, aguarde a chamada da equipe.</span>
          <span>VG Salva Vidas</span>
        </div>
      </section>

      <div className="tv-info-card">
        <span className="tv-info-icon"><Monitor aria-hidden="true" size={18} /></span>
        <div>
          <strong>Chamadas ainda não conectadas</strong>
          <p>Este painel mostra apenas o layout. A publicação de chamadas ficará disponível quando a sessão e a integração de dados estiverem prontas.</p>
        </div>
        <button type="button" className="text-action" onClick={() => onNotify("Nenhuma chamada foi publicada.")}>Entendi</button>
      </div>
    </div>
  );
}
