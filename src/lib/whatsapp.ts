// WhatsApp utility functions
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // Add country code if not present
  return cleaned.length === 10 ? `91${cleaned}` : cleaned;
}

const REQUIREMENT_LABELS: Record<string, string> = {
  buy: "buying",
  rent: "renting",
  invest: "investing",
  sell: "selling",
};

export function createWhatsAppMessage(
  name: string,
  requirement: string | string[],
  areas?: string | string[],
  budget?: string
): string {
  const areasArr = Array.isArray(areas) ? areas : areas ? [areas] : [];
  const reqArr = Array.isArray(requirement) ? requirement : requirement ? [requirement] : [];
  const areaText = areasArr.length > 0 ? ` in ${areasArr.join(", ")}` : "";
  const requirementText =
    reqArr.length > 0
      ? reqArr.map((r) => REQUIREMENT_LABELS[r] ?? r).join(", ")
      : "property";
  const budgetText = budget ? ` Budget: ${budget}.` : "";
  return `Hi Charushila, I'm looking for a property${areaText}. My name is ${name}. I'm interested in ${requirementText}.${budgetText} Please help me!`;
}

export function openWhatsApp(
  phoneNumber: string,
  message: string,
  _target: string = "_blank"
): void {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  window.open(whatsappUrl, _target);
}
