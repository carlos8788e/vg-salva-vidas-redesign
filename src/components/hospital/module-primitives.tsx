import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ShieldCheck } from "lucide-react";

export type ModuleKey =
  | "overview"
  | "registration"
  | "triage"
  | "medical"
  | "admissions"
  | "medications"
  | "tv";

export type NoticeHandler = (message: string) => void;

export function ModuleHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="module-heading-row">
      <div className="module-heading">
        <p className="module-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="module-description">{description}</p>
      </div>
      {actions ? <div className="module-heading-actions">{actions}</div> : null}
    </div>
  );
}

export function PreviewNotice({ children }: { children: ReactNode }) {
  return (
    <div className="preview-notice" role="note">
      <ShieldCheck aria-hidden="true" size={18} />
      <p>{children}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">
        <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`surface-card ${className}`.trim()}>
      <div className="surface-card-heading">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="surface-card-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
