import { jsPDF } from "jspdf";

export type DischargePdfDetails = {
  patientName: string;
  dateOfBirth: string;
  diagnosis: string;
  dischargeSummary: string;
  medications: string;
  followUp: string;
  physicianName: string;
  dischargedAt: string;
};

export function downloadDischargePdf(details: DischargePdfDetails) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const left = 18;
  const pageBottom = 275;
  let y = 22;

  const writeText = (text: string, options?: { bold?: boolean; size?: number }) => {
    pdf.setFont("helvetica", options?.bold ? "bold" : "normal");
    pdf.setFontSize(options?.size ?? 11);
    const lines = pdf.splitTextToSize(text || "Não informado", 174) as string[];
    const blockHeight = lines.length * 5.5;
    if (y + blockHeight > pageBottom) {
      pdf.addPage();
      y = 22;
    }
    pdf.text(lines, left, y);
    y += blockHeight + 4;
  };

  pdf.setTextColor(16, 43, 58);
  writeText("VG SALVA VIDAS", { bold: true, size: 18 });
  pdf.setTextColor(28, 116, 121);
  writeText("Resumo de alta hospitalar", { bold: true, size: 14 });
  pdf.setDrawColor(210, 225, 221);
  pdf.line(left, y, 192, y);
  y += 10;
  pdf.setTextColor(24, 54, 69);
  writeText(`Paciente: ${details.patientName}`, { bold: true });
  writeText(`Data de nascimento: ${details.dateOfBirth}`);
  writeText(`Data da alta: ${details.dischargedAt}`);
  writeText(`Diagnóstico: ${details.diagnosis}`);
  writeText("Resumo clínico", { bold: true, size: 12 });
  writeText(details.dischargeSummary);
  writeText("Medicações e orientações", { bold: true, size: 12 });
  writeText(details.medications);
  writeText("Acompanhamento recomendado", { bold: true, size: 12 });
  writeText(details.followUp);
  y += 5;
  pdf.line(left, y, 105, y);
  y += 7;
  writeText(`Profissional responsável: ${details.physicianName}`);
  writeText("Este documento é um resumo de alta e deve ser acompanhado pelas orientações da equipe assistencial.", { size: 9 });

  const safeName = details.patientName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
  pdf.save(`alta-${safeName || "paciente"}.pdf`);
}
