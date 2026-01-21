// WhatsApp utility functions
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // Add country code if not present
  return cleaned.length === 10 ? `91${cleaned}` : cleaned;
}

export function createWhatsAppMessage(
  name: string,
  requirement: string,
  area?: string
): string {
  const areaText = area ? ` in ${area}` : "";
  // Convert requirement to proper gerund form
  const requirementText = requirement === "buy" ? "buying" : requirement === "rent" ? "renting" : "investing";
  return `Hi Charushila, I'm looking for a property${areaText}. My name is ${name}. I'm interested in ${requirementText}. Please help me!`;
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

export function createCallLink(phoneNumber: string): string {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  return `tel:+${formattedPhone}`;
}
