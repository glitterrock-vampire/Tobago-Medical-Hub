import type { Service } from "@workspace/api-client-react";

export const defaultServices: Service[] = [
  {
    id: 1,
    name: "General Consultation",
    description: "Routine medical consultation for common concerns, symptoms, prescriptions, and follow-up care.",
    category: "general",
    durationMinutes: 30,
    isHomeVisitAvailable: true,
  },
  {
    id: 2,
    name: "Wellness Checkup",
    description: "Preventive health review including vitals, risk screening, and personalized medical guidance.",
    category: "checkup",
    durationMinutes: 45,
    isHomeVisitAvailable: false,
  },
  {
    id: 3,
    name: "Chronic Disease Review",
    description: "Ongoing support for hypertension, diabetes, asthma, and other long-term health conditions.",
    category: "specialist",
    durationMinutes: 45,
    isHomeVisitAvailable: true,
  },
  {
    id: 4,
    name: "Medication Review",
    description: "Review current medicines, renew prescriptions, and discuss side effects or treatment concerns.",
    category: "general",
    durationMinutes: 30,
    isHomeVisitAvailable: false,
  },
  {
    id: 5,
    name: "Home Visit",
    description: "Doctor visit at home for patients who need care outside the clinic setting.",
    category: "general",
    durationMinutes: 60,
    isHomeVisitAvailable: true,
  },
  {
    id: 6,
    name: "Follow-up Visit",
    description: "Post-consultation review to monitor recovery, results, or changes to a treatment plan.",
    category: "checkup",
    durationMinutes: 30,
    isHomeVisitAvailable: true,
  },
];
