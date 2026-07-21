export const defaultServices = [
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
    name: "Driver's Licence Medical",
    description: "Medical assessment and form support for driver's licence requirements.",
    category: "checkup",
    durationMinutes: 30,
    isHomeVisitAvailable: false,
  },
  {
    id: 3,
    name: "Food Badge Medical",
    description: "Food badge medicals for individuals and groups. $100 per person, or $80 per person for groups of 8 or more.",
    category: "checkup",
    durationMinutes: 30,
    isHomeVisitAvailable: false,
  },
  {
    id: 4,
    name: "Firearm Medical",
    description: "Medical assessment for firearm application or renewal requirements.",
    category: "checkup",
    durationMinutes: 30,
    isHomeVisitAvailable: false,
  },
  {
    id: 5,
    name: "School / University Medical",
    description: "Medical examination for students starting school, college, or university.",
    category: "checkup",
    durationMinutes: 30,
    isHomeVisitAvailable: false,
  },
  {
    id: 6,
    name: "Chronic Disease Review",
    description: "Ongoing support for hypertension, diabetes, asthma, and other long-term health conditions.",
    category: "specialist",
    durationMinutes: 45,
    isHomeVisitAvailable: true,
  },
  {
    id: 7,
    name: "Home Visit",
    description: "Doctor visit at home for patients who need care outside the clinic setting.",
    category: "general",
    durationMinutes: 60,
    isHomeVisitAvailable: true,
  },
  {
    id: 8,
    name: "Passport Photos",
    description: "Passport-style photo service. 2 photos for $25, or 4 photos for $45.",
    category: "photos",
    durationMinutes: 15,
    isHomeVisitAvailable: false,
  },
  {
    id: 9,
    name: "Document Printing",
    description: "Document printing service. Black and white printing is $2 per page. Colour starts at $4 per page depending on graphics.",
    category: "documents",
    durationMinutes: 15,
    isHomeVisitAvailable: false,
  },
  {
    id: 10,
    name: "Follow-up Visit",
    description: "Post-consultation review to monitor recovery, results, or changes to a treatment plan.",
    category: "general",
    durationMinutes: 30,
    isHomeVisitAvailable: true,
  },
] as const;

export type DefaultService = (typeof defaultServices)[number];

export function getDefaultServiceName(serviceId: number) {
  return defaultServices.find((service) => service.id === serviceId)?.name ?? `Service #${serviceId}`;
}
