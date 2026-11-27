"use client";

import Image from "next/image";
import {
  Activity,
  BedDouble,
  ClipboardList,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Monitor,
  Pill,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";
import type { ModuleKey } from "./module-primitives";

export const NAV_ITEMS: {
  id: ModuleKey;
  label: string;
  group: string;
  icon: LucideIcon;
}[] = [
  { id: "overview", label: "Visão geral", group: "Painel", icon: LayoutDashboard },
  { id: "registration", label: "Atendimento", group: "Atendimento", icon: UserRoundPlus },
  { id: "triage", label: "Triagem", group: "Atendimento", icon: Activity },
  { id: "medical", label: "Médico", group: "Atendimento", icon: HeartPulse },
  { id: "admissions", label: "Internações", group: "Gestão", icon: BedDouble },
  { id: "medications", label: "Medicações", group: "Gestão", icon: Pill },
  { id: "tv", label: "Painel TV", group: "Gestão", icon: Monitor },
];

const NAV_GROUPS = ["Painel", "Atendimento", "Gestão"];

export function Sidebar({
  activeModule,
  onSelect,
}: {
  activeModule: ModuleKey;
  onSelect: (module: ModuleKey) => void;
}) {
  return (
    <aside className="hospital-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo-wrap">
          <Image
            src="/logo.jpg"
            alt="Logotipo VG Salva Vidas"
            width={958}
            height={1120}
            priority
            className="sidebar-logo"
          />
        </div>
        <div className="sidebar-brand-copy">
          <strong>VG Salva Vidas</strong>
          <span>Gestão hospitalar</span>
        </div>
      </div>

      <nav className="sidebar-navigation" aria-label="Navegação principal">
        {NAV_GROUPS.map((group) => (
          <div className="nav-group" key={group}>
            <p className="nav-group-label">{group}</p>
            <div className="nav-group-items">
              {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`nav-item${isActive ? " is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onSelect(item.id)}
                  >
                    <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-status-icon">
          <ClipboardList aria-hidden="true" size={18} />
        </div>
        <div>
          <strong>Modo de prévia</strong>
          <span>Dados reais protegidos</span>
        </div>
        <FileText aria-hidden="true" className="sidebar-bottom-mark" size={16} />
      </div>
    </aside>
  );
}
