import { Container } from "@/components/ui/Container";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Vibha Realties",
  description: "Privacy Policy for Vibha Realties - Property Consultant in Pune",
};

export default function PrivacyPolicy() {
  return (
    <div className="py-16 md:py-24 bg-(--color-primary)">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>
          <div className="text-sm text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                1. Introduction
              </h2>
              <p>
                Welcome to Vibha Realties ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                2.1 Personal Information
              </h3>
              <p>
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fill out contact forms or enquiry forms</li>
                <li>Subscribe to our newsletter or updates</li>
                <li>Contact us via WhatsApp, phone, or email</li>
                <li>Request property information or consultations</li>
              </ul>
              <p className="mt-4">
                This information may include your name, email address, phone number, property preferences, and any other information you choose to provide.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                2.2 Automatically Collected Information
              </h3>
              <p>
                When you visit our website, we may automatically collect certain information about your device, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages you visit and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Device information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                3. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Respond to your enquiries and provide customer service</li>
                <li>Send you property listings and information based on your preferences</li>
                <li>Improve our website and services</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>With service providers who assist us in operating our website (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                5. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                6. Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Correct inaccurate or incomplete information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us using the contact information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              <p>
                Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can set your browser to refuse cookies, but this may limit some functionality of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                8. Third-Party Links
              </h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                9. Children's Privacy
              </h2>
              <p>
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                10. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                11. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="mt-4 p-4 bg-(--color-secondary) rounded-lg">
                <p className="font-semibold">Charushila Bhalerao</p>
                <p>Vibha Realties</p>
                <p>Pune, Maharashtra, India</p>
                <p className="mt-2">
                  WhatsApp: <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919881199152"}`} className="text-green-600 hover:text-green-700">Contact via WhatsApp</a>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
