import { DeploymentPreview } from "./components/deployment-preview";
import { FeaturesSection } from "./components/features-section";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";
import { AuthRedirect } from "./components/auth-redirect";
import { SiteHeader } from "./components/site-header";

export default function Home() {
  return (
    <main>
      <AuthRedirect whenAuthenticated="/app" />
      <SiteHeader />
      <Hero />
      <DeploymentPreview />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
