import { Container } from "@/components/ui/Container";
import { TestimonialsList } from "@/components/TestimonialsList";

export default function Testimonials() {
  return (
    <>
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Happy Clients
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            Read what my clients have to say about their experience.
          </p>

          <TestimonialsList />
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-blue-50">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Hundreds of Happy Customers
            </h2>
            <p className="text-lg text-gray-700">
              Start your property journey with me today.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
