import { LandingHeader } from "./_components/landing-header";
import { LandingHero } from "./_components/landing-hero";

export default async function HomePage() {
  return (
    <div>
      <LandingHeader />
      <LandingHero />
      {/* <LandingEppSection /> */}
      {/* <LandingCompareSection /> */}
      {/* <LandingProcessSection /> */}
      Hey
    </div>
  );
}
