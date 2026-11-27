import { PatientRegistrationForm } from "@/components/hospital/auth/patient-registration-form";

export const metadata = {
  title: "Cadastro de paciente | VG Salva Vidas",
  description: "Formulário público para cadastro de pacientes no VG Salva Vidas.",
};

export default function PatientRegistrationPage() {
  return <PatientRegistrationForm />;
}
