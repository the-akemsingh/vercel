import { GitBranchIcon, GlobeIcon, ShieldIcon } from "./icons";
import { ScrollReveal } from "./scroll-reveal";

const features = [
  { icon: GitBranchIcon, title: "Native Git workflow", description: "Push to deploy, with previews automatically built for every branch." },
  { icon: GlobeIcon, title: "Global from day one", description: "Put your application close to every customer without extra configuration." },
  { icon: ShieldIcon, title: "Safe by default", description: "Protected deployments, encrypted credentials, and instant rollback when you need it." },
];

export function FeaturesSection() {
  return (
    <section className="features-section" id="features">
      <ScrollReveal className="features-heading">
        <p className="eyebrow"><span />Built for momentum</p>
        <h2>Move from idea to internet, faster.</h2>
      </ScrollReveal>
      <div className="feature-grid">
        {features.map(({ icon: Icon, title, description }, index) => (
          <ScrollReveal className="feature-card" delay={index * 80} key={title}>
            <span className="feature-icon"><Icon /></span>
            <h3>{title}</h3>
            <p>{description}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
