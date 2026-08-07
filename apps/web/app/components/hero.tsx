import { CrystallineHero } from "./crystalline-hero";
import { CheckIcon } from "./icons";
import GoogleSignIn from "./auth-panel";
const proofPoints = ["Deploy from any Git repository", "Preview every pull request", "Roll back in one click"];
export function Hero() {
  return (
    <section className="hero" id="top">
      <CrystallineHero />
      <div className="hero-copy hero-animate">
        <p className="eyebrow"><span />Deployment infrastructure for builders</p>
        <h1>Ship what matters.<br /><em>We&apos;ll handle the launch.</em></h1>
        <p className="hero-description">
          From your first commit to a production URL, Launchpad gives your team a calm, reliable path to deploy.
        </p>
        <div className="hero-proof" aria-label="Platform benefits">
          {proofPoints.map((point) => (
            <span key={point}><CheckIcon />{point}</span>
          ))}
        </div>
      </div>
      <aside className="auth-card hero-animate hero-animate--late" id="sign-in">
        <p className="auth-card__kicker">Your next release starts here</p>
        <h2>Deploy an application today.</h2>
        <p>Sign in with Google to connect your project and get a live URL in minutes.</p>
        <GoogleSignIn />
        <small>By continuing, you agree to our Terms and Privacy Policy.</small>
      </aside>
    </section>
  );
}
