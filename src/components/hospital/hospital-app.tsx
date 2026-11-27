"use client";

import { useRef, useState } from "react";
import { Bell, ChevronRight, Search, ShieldCheck } from "lucide-react";
import { NAV_ITEMS, Sidebar } from "./sidebar";
import type { ModuleKey } from "./module-primitives";
import { OverviewModule } from "./modules/overview";
import { PatientIntakeModule } from "./modules/patient-intake";
import { TriageModule } from "./modules/triage";
import { ConsultationModule } from "./modules/consultation";
import { AdmissionsModule } from "./modules/admissions";
import { MedicationsModule } from "./modules/medications";
import { TvDisplayModule } from "./modules/tv-display";

export function HospitalApp() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("overview");
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeItem = NAV_ITEMS.find((item) => item.id === activeModule);

  function showNotice(message: string) {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 4500);
  }

  function navigateTo(module: ModuleKey) {
    setActiveModule(module);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderActiveModule() {
    switch (activeModule) {
      case "registration":
        return <PatientIntakeModule onNotify={showNotice} />;
      case "triage":
        return <TriageModule onNotify={showNotice} />;
      case "medical":
        return (
          <ConsultationModule
            onNotify={showNotice}
            onNavigate={navigateTo}
          />
        );
      case "admissions":
        return <AdmissionsModule onNavigate={navigateTo} />;
      case "medications":
        return <MedicationsModule onNavigate={navigateTo} />;
      case "tv":
        return <TvDisplayModule onNotify={showNotice} />;
      case "overview":
      default:
        return (
          <OverviewModule
            onNavigate={navigateTo}
            onNotify={showNotice}
          />
        );
    }
  }

  return (
    <div className="app-shell">
      <Sidebar activeModule={activeModule} onSelect={navigateTo} />
      <div className="app-main-column">
        <header className="app-topbar">
          <div className="topbar-breadcrumb">
            <span>VG Salva Vidas</span>
            <ChevronRight aria-hidden="true" size={15} />
            <strong>{activeItem?.label ?? "Visão geral"}</strong>
          </div>
          <div className="topbar-tools">
            <label className="topbar-search">
              <Search aria-hidden="true" size={16} />
              <input
                type="search"
                placeholder="Busca disponível após conexão segura"
                aria-label="Busca indisponível nesta prévia"
                disabled
              />
            </label>
            <span className="topbar-preview-pill">
              <ShieldCheck aria-hidden="true" size={15} />
              Prévia segura
            </span>
            <button
              type="button"
              className="icon-button topbar-notifications"
              aria-label="Informações sobre notificações"
              onClick={() =>
                showNotice("Notificações serão ativadas com a conexão segura do sistema.")
              }
            >
              <Bell aria-hidden="true" size={18} />
            </button>
          </div>
        </header>

        <main id="main-content" className="app-content">
          {renderActiveModule()}
          <footer className="app-footer">
            <span>VG Salva Vidas</span>
            <span>Prévia de interface · Sem dados clínicos conectados</span>
          </footer>
        </main>
      </div>
      <div className="live-notice" role="status" aria-live="polite">
        {notice ? <span>{notice}</span> : null}
      </div>
    </div>
  );
}
