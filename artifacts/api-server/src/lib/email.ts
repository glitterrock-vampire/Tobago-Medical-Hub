import { Resend } from "resend";

type AppointmentNotification = {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  isHomeVisit: boolean;
  address: string | null;
  notes: string | null;
};

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) return null;

  return {
    apiKey,
    to: process.env.APPOINTMENT_EMAIL_TO || "DR.T.QUACCOO@GMAIL.COM",
    cc: process.env.APPOINTMENT_EMAIL_CC || undefined,
    from:
      process.env.EMAIL_FROM ||
      "Tobago East Medical Services <onboarding@resend.dev>",
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatOptional(value: string | null | undefined) {
  return value?.trim() ? value.trim() : "Not provided";
}

function buildAppointmentEmail(appointment: AppointmentNotification) {
  const homeVisit = appointment.isHomeVisit ? "Yes" : "No";
  const lines = [
    "New appointment request",
    "",
    `Appointment ID: ${appointment.id}`,
    `Patient: ${appointment.patientName}`,
    `Email: ${appointment.patientEmail}`,
    `Phone: ${appointment.patientPhone}`,
    `Service: ${appointment.serviceName}`,
    `Preferred date: ${appointment.preferredDate}`,
    `Preferred time: ${appointment.preferredTime}`,
    `Home visit: ${homeVisit}`,
    `Address: ${formatOptional(appointment.address)}`,
    `Notes: ${formatOptional(appointment.notes)}`,
    "",
    "Please confirm, reschedule, or follow up from the staff dashboard.",
  ];

  const rows = [
    ["Appointment ID", String(appointment.id)],
    ["Patient", appointment.patientName],
    ["Email", appointment.patientEmail],
    ["Phone", appointment.patientPhone],
    ["Service", appointment.serviceName],
    ["Preferred date", appointment.preferredDate],
    ["Preferred time", appointment.preferredTime],
    ["Home visit", homeVisit],
    ["Address", formatOptional(appointment.address)],
    ["Notes", formatOptional(appointment.notes)],
  ];

  return {
    text: lines.join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #3D2E2E; line-height: 1.5;">
        <h2 style="color: #7B4435;">New appointment request</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #E8C5B8; width: 180px;">${escapeHtml(label)}</th>
                  <td style="padding: 8px; border-bottom: 1px solid #E8C5B8;">${escapeHtml(value)}</td>
                </tr>
              `,
            )
            .join("")}
        </table>
        <p>Please confirm, reschedule, or follow up from the staff dashboard.</p>
      </div>
    `,
  };
}

export async function sendAppointmentNotification(
  appointment: AppointmentNotification,
) {
  const config = getEmailConfig();

  if (!config) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(config.apiKey);
  const message = buildAppointmentEmail(appointment);

  const { error } = await resend.emails.send({
    from: config.from,
    to: [config.to],
    cc: config.cc ? [config.cc] : undefined,
    replyTo: appointment.patientEmail,
    subject: `New appointment request: ${appointment.patientName}`,
    text: message.text,
    html: message.html,
  });

  if (error) {
    throw new Error(`Resend failed to send appointment email: ${error.message}`);
  }
}
