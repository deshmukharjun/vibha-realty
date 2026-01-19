import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { BlogList } from "@/components/BlogList";

export default function Blog() {
  return (
    <>
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Residential Updates & Insights
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              Stay informed with Charushila's latest blogs on new and upcoming residential developments in Pune.
            </p>
            <p className="text-lg text-gray-600">
              Discover market trends, investment opportunities, and expert insights to help you make informed property decisions.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16 bg-gray-50 border-b border-gray-200">
        <Container>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Search blogs..." 
              className="flex-1 px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-gray-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700">
              <option value="">All Categories</option>
              <option value="residential-updates">Residential Updates</option>
              <option value="investment-guide">Investment Guide</option>
              <option value="commercial-insights">Commercial Insights</option>
            </select>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <Container>
          <BlogList />
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Looking for Specific Property Updates?
            </h2>
            <p className="text-gray-700 mb-8">
              Subscribe to get notified about new blog posts and residential opportunities in your preferred areas.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="md">
                <Image src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} />
                Contact Me for Updates
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
