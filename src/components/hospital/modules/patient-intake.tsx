import { ArrowRight, UserRoundPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { NoticeHandler } from "../module-primitives";
import { ModuleHeading, PreviewNotice, SectionCard } from "../module-primitives";

export function PatientIntakeModule({ onNotify }: { onNotify: NoticeHandler }) {
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    const fields = new FormData(form);
    const payload = {
      full_name: fields.get("fullName"),
      date_of_birth: fields.get("dateOfBirth"),
      sex: fields.get("sex") || null,
      document_type: fields.get("documentType") || null,
      document_number: fields.get("documentNumber") || null,
      mother_name: fields.get("motherName") || null,
      marital_status: fields.get("maritalStatus") || null,
      phone: fields.get("phone") || null,
      email: fields.get("email") || null,
      address: fields.get("address") || null,
      emergency_contact_name: fields.get("emergencyContactName") || null,
      emergency_contact_phone: fields.get("emergencyContactPhone") || null,
      emergency_relationship: fields.get("emergencyRelationship") || null,
      payment_type: fields.get("paymentType") || null,
    };
    const response = await fetch("/api/registrations", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    }).catch(() => null);
    const result = await response?.json().catch(() => null);
    if (!response?.ok) {
      onNotify(result?.error ?? "Não foi possível salvar o cadastro.");
      setBusy(false);
      return;
    }
    form.reset();
    onNotify("Cadastro salvo. O paciente já pode ser localizado para internação.");
    setBusy(false);
  }

  return (
    <div className="module-stack">
      <ModuleHeading
        eyebrow="Recepção"
        title="Novo atendimento"
        description="Registre a identificação do paciente e prepare o encaminhamento para triagem."
        actions={<span className="status-chip status-chip--active">Cadastro conectado</span>}
      />

      <PreviewNotice>
        As informações são gravadas no cadastro hospitalar e só ficam visíveis à equipe após autenticação.
      </PreviewNotice>

      <SectionCard
        title="Cadastro do paciente"
        description="Campos organizados para agilizar a recepção e reduzir retrabalho."
      >
        <form className="form-layout" onSubmit={handleSubmit}>
          <div className="form-section-label">
            <span className="form-section-icon"><UserRoundPlus aria-hidden="true" size={17} /></span>
            <div>
              <strong>Identificação</strong>
              <span>Informações pessoais e documento.</span>
            </div>
          </div>
          <div className="form-grid form-grid--two">
            <div className="field field--wide">
              <label htmlFor="patient-name">Nome completo <span aria-hidden="true">*</span></label>
              <input id="patient-name" name="fullName" autoComplete="off" placeholder="Nome completo do paciente" required />
            </div>
            <div className="field">
              <label htmlFor="patient-birth">Data de nascimento <span aria-hidden="true">*</span></label>
              <input id="patient-birth" name="dateOfBirth" type="date" autoComplete="off" required />
            </div>
            <div className="field">
              <label htmlFor="patient-sex">Sexo</label>
              <select id="patient-sex" name="sex" defaultValue="">
                <option value="">Selecione</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="outro">Outro</option>
                <option value="nao-informado">Prefere não informar</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="patient-document-type">Tipo de documento</label>
              <select id="patient-document-type" name="documentType" defaultValue="cpf">
                <option value="cpf">CPF</option>
                <option value="rg">RG</option>
                <option value="cns">Cartão Nacional de Saúde</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="patient-document">Número do documento</label>
              <input id="patient-document" name="documentNumber" autoComplete="off" placeholder="Informe o documento" />
            </div>
            <div className="field">
              <label htmlFor="patient-mother">Nome da mãe</label>
              <input id="patient-mother" name="motherName" autoComplete="off" placeholder="Nome completo" />
            </div>
            <div className="field">
              <label htmlFor="patient-marital">Estado civil</label>
              <select id="patient-marital" name="maritalStatus" defaultValue="">
                <option value="">Selecione</option>
                <option>Solteiro(a)</option>
                <option>Casado(a)</option>
                <option>Divorciado(a)</option>
                <option>Viúvo(a)</option>
                <option>Outro</option>
              </select>
            </div>
          </div>

          <div className="form-divider" />
          <div className="form-section-label">
            <span className="form-section-icon form-section-icon--blue"><UserRoundPlus aria-hidden="true" size={17} /></span>
            <div>
              <strong>Contato e atendimento</strong>
              <span>Dados de contato e pessoa responsável.</span>
            </div>
          </div>
          <div className="form-grid form-grid--two">
            <div className="field">
              <label htmlFor="patient-phone">Telefone</label>
              <input id="patient-phone" name="phone" type="tel" autoComplete="off" placeholder="(00) 00000-0000" />
            </div>
            <div className="field">
              <label htmlFor="patient-email">E-mail</label>
              <input id="patient-email" name="email" type="email" autoComplete="off" placeholder="nome@exemplo.com" />
            </div>
            <div className="field field--wide">
              <label htmlFor="patient-address">Endereço</label>
              <input id="patient-address" name="address" autoComplete="off" placeholder="Rua, número, bairro e cidade" />
            </div>
            <div className="field">
              <label htmlFor="emergency-name">Contato de emergência</label>
              <input id="emergency-name" name="emergencyContactName" autoComplete="off" placeholder="Nome do contato" />
            </div>
            <div className="field">
              <label htmlFor="emergency-phone">Telefone de emergência</label>
              <input id="emergency-phone" name="emergencyContactPhone" type="tel" autoComplete="off" placeholder="(00) 00000-0000" />
            </div>
            <div className="field">
              <label htmlFor="emergency-relationship">Vínculo do contato</label>
              <input id="emergency-relationship" name="emergencyRelationship" autoComplete="off" placeholder="Ex.: familiar" />
            </div>
            <div className="field">
              <label htmlFor="payment-type">Tipo de atendimento</label>
              <select id="payment-type" name="paymentType" defaultValue="">
                <option value="">Selecione</option>
                <option value="sus">SUS</option>
                <option value="convenio">Convênio</option>
                <option value="particular">Particular</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <p>O acesso à recepção exige uma sessão médica ativa.</p>
            <button type="submit" className="button button-primary" disabled={busy}>
              {busy ? "Salvando…" : "Salvar cadastro"}
              <ArrowRight aria-hidden="true" size={16} />
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
